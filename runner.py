#!/usr/bin/env python3
"""
runner.py - Passerelle Marchés Boursiers & Serveur Statique Local
Violet Startpage

Fournit une passerelle CORS haute performance pour les cotations réelles Yahoo Finance
(actions, ETF, indices, matières premières, devises) et sert les fichiers statiques.

Usage:
    ./runner.py              (démarre sur http://localhost:3000)
    python3 runner.py 8080   (démarre sur le port 8080)
"""

import http.server
import socketserver
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import datetime
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

DEFAULT_PORT = 3000
WORKSPACE_DIR = Path(__file__).resolve().parent

# ========================================================
# PROXY MARCHÉS & COTATIONS RÉELLES (YAHOO FINANCE & CACHE)
# ========================================================
YAHOO_MAPPING = {
    # 1. Actions Internationales & Mega-Caps
    'nvda': 'NVDA',
    'tsla': 'TSLA',
    'aapl': 'AAPL',
    'msft': 'MSFT',
    'googl': 'GOOGL',
    'amzn': 'AMZN',
    'meta': 'META',
    'mstr': 'MSTR',
    'mc': 'MC.PA',
    'asml': 'ASML.AS',
    'tte': 'TTE.PA',
    # 2. ETF & Fonds Indiciels Majeurs
    '10ap': '500.PA',
    'lyp6': 'LYP6.DE',
    'xmme': 'XMME.DE',
    'cw8': 'CW8.PA',
    'vwce': 'VWCE.DE',
    'eqqq': 'EQQQ.DE',
    'inrg': 'IQQH.DE',
    'psp5': 'PSP5.PA',
    # 3. Grands Indices Boursiers
    'sp500': '^GSPC',
    'nasdaq100': '^NDX',
    'cac40': '^FCHI',
    'dax40': '^GDAXI',
    'dji': '^DJI',
    'stoxx50': '^STOXX50E',
    'nikkei': '^N225',
    'ftse100': '^FTSE',
    # 4. Matières Premières & Énergie
    'gold': 'GC=F',
    'silver': 'SI=F',
    'brent': 'BZ=F',
    # 5. Forex & Devises
    'eurusd': 'EURUSD=X',
    'eurgbp': 'EURGBP=X',
    'eurchf': 'EURCHF=X',
    'eurjpy': 'EURJPY=X'
}

# Cache en mémoire avec TTL de 180 secondes (3 minutes) pour préserver les requêtes
_market_quotes_cache = {
    'timestamp': 0,
    'data': {}
}
QUOTES_CACHE_TTL = 180

# Cache des graphiques 24h { cache_key: { 'timestamp': t, 'data': d } }
_market_chart_cache = {}
CHART_CACHE_TTL = 180


def fetch_single_quote(item):
    asset_id, symbol = item
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range=1d&interval=15m"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode('utf-8'))['chart']['result'][0]
            meta = data['meta']
            price = meta.get('regularMarketPrice')
            prev = meta.get('chartPreviousClose') or meta.get('previousClose')
            if price is not None:
                chg = round(((price - prev) / prev) * 100, 2) if (prev and prev > 0) else 0.0
                day_low = meta.get('regularMarketDayLow') or price
                day_high = meta.get('regularMarketDayHigh') or price
                return asset_id, {
                    'price': round(price, 4 if price < 2 else 2),
                    'change': chg,
                    'dayLow': round(day_low, 4 if day_low < 2 else 2),
                    'dayHigh': round(day_high, 4 if day_high < 2 else 2),
                    'currency': meta.get('currency', 'EUR'),
                    'symbol': symbol,
                    'marketTime': meta.get('regularMarketTime')
                }
    except Exception:
        pass
    return asset_id, None


def get_market_quotes(force=False):
    global _market_quotes_cache
    now = time.time()
    if not force and _market_quotes_cache['data'] and (now - _market_quotes_cache['timestamp'] < QUOTES_CACHE_TTL):
        return _market_quotes_cache['data'], True

    with ThreadPoolExecutor(max_workers=8) as executor:
        results = dict(executor.map(fetch_single_quote, YAHOO_MAPPING.items()))

    valid_results = {k: v for k, v in results.items() if v is not None}
    if valid_results:
        merged = {**_market_quotes_cache['data'], **valid_results}
        _market_quotes_cache['data'] = merged
        _market_quotes_cache['timestamp'] = now
        return merged, False
    return _market_quotes_cache['data'], True


def get_market_chart(asset_id, range_param='1d', interval_param='5m'):
    global _market_chart_cache
    symbol = YAHOO_MAPPING.get(asset_id, asset_id)
    cache_key = f"{symbol}_{range_param}_{interval_param}"
    now = time.time()

    cached = _market_chart_cache.get(cache_key)
    if cached and (now - cached['timestamp'] < CHART_CACHE_TTL):
        return cached['data'], True

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={range_param}&interval={interval_param}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    })
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))['chart']['result'][0]
            meta = data['meta']
            ts = data.get('timestamp', [])
            closes = data.get('indicators', {}).get('quote', [{}])[0].get('close', [])

            points = []
            for t, p in zip(ts, closes):
                if p is not None:
                    dt = datetime.datetime.fromtimestamp(t)
                    time_label = dt.strftime('%H:%M')
                    points.append({
                        'timestamp': t,
                        'price': round(p, 4 if p < 2 else 2),
                        'timeLabel': time_label
                    })

            if points:
                if len(points) > 28:
                    step = max(1, len(points) // 20)
                    sampled = [points[i] for i in range(0, len(points), step)]
                    if sampled[-1] != points[-1]:
                        sampled.append(points[-1])
                    points = sampled

                prices = [p['price'] for p in points]
                start_p = points[0]['price']
                end_p = points[-1]['price']
                chg_pct = round(((end_p - start_p) / start_p) * 100, 2) if start_p else 0.0

                result = {
                    'asset': asset_id,
                    'symbol': symbol,
                    'points': points,
                    'startPrice': start_p,
                    'endPrice': end_p,
                    'changePct': chg_pct,
                    'high': round(max(prices), 2),
                    'low': round(min(prices), 2),
                    'axisLabels': {
                        'start': points[0]['timeLabel'],
                        'mid': points[len(points) // 2]['timeLabel'],
                        'end': 'Maintenant (Direct)'
                    }
                }
                _market_chart_cache[cache_key] = {'timestamp': now, 'data': result}
                return result, False
    except Exception:
        pass
    return None, False


class MarketGatewayHandler(http.server.SimpleHTTPRequestHandler):
    """Serveur HTTP statique + Passerelle API Marchés pour le dashboard."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WORKSPACE_DIR), **kwargs)

    def end_headers(self):
        # En-têtes CORS universels pour autoriser tout appel depuis le navigateur
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            payload = {
                'status': 'ok',
                'engine': 'local-native',
                'service': 'Violet Market Gateway',
                'message': 'Passerelle Marchés active'
            }
            self.wfile.write(json.dumps(payload, indent=2).encode('utf-8'))
            return

        if path == '/api/market/quotes':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
            force = query.get('force', ['0'])[0] in ('1', 'true', 'True')
            quotes, is_cached = get_market_quotes(force=force)
            payload = {
                'status': 'ok',
                'cached': is_cached,
                'source': 'live',
                'timestamp': _market_quotes_cache['timestamp'],
                'quotes': quotes
            }
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        if path == '/api/market/chart':
            asset_id = query.get('asset', ['nvda'])[0]
            range_param = query.get('range', ['1d'])[0]
            interval_param = query.get('interval', ['5m'])[0]
            chart_data, is_cached = get_market_chart(asset_id, range_param, interval_param)
            if chart_data:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'ok',
                    'cached': is_cached,
                    'source': 'live',
                    'data': chart_data
                }).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'error',
                    'message': f'Aucune donnée pour {asset_id}'
                }).encode('utf-8'))
            return

        super().do_GET()

    def log_message(self, format, *args):
        if any(k in args[0] for k in ('/api/status', '/api/market')):
            print(f"[Market Gateway] {args[0]}")
        else:
            super().log_message(format, *args)


def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    print("\n" + "=" * 65)
    print(" 📈 VIOLET STARTPAGE // PASSERELLE MARCHÉS & SERVEUR LOCAL")
    print("=" * 65)
    print(f" 🌐 Dashboard disponible sur : http://localhost:{port}")
    print(f" 📊 Passerelle Yahoo Finance active : {len(YAHOO_MAPPING)} actifs surveillés")
    print("=" * 65)
    print(" Prêt ! Appuyez sur Ctrl+C pour arrêter.\n")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), MarketGatewayHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[Market Gateway] Arrêt du serveur compagnon. À bientôt !")


if __name__ == '__main__':
    main()
