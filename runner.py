#!/usr/bin/env python3
"""
runner.py - Serveur Compagnon & Moteur d'Exécution Local
Violet Dev Studio // Startpage Dashboard

Permet d'exécuter C, Java, Python, Oz, Bash et JavaScript directement sur votre
machine locale en quelques millisecondes, avec vos propres compilateurs installés.

Usage:
    ./runner.py              (démarre sur http://localhost:3000)
    python3 runner.py 8080   (démarre sur le port 8080)
"""

import http.server
import socketserver
import json
import subprocess
import tempfile
import os
import sys
import re
import time
import shutil
import urllib.request
import urllib.parse
import datetime
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

DEFAULT_PORT = 3000
WORKSPACE_DIR = Path(__file__).resolve().parent

def detect_compilers():
    """Détecte les outils de développement installés localement sur la machine."""
    tools = {
        'gcc': shutil.which('gcc'),
        'clang': shutil.which('clang'),
        'python3': shutil.which('python3'),
        'javac': shutil.which('javac'),
        'java': shutil.which('java'),
        'ozc': shutil.which('ozc'),
        'ozengine': shutil.which('ozengine'),
        'node': shutil.which('node'),
        'bash': shutil.which('bash')
    }
    return tools

def wrap_oz_code(user_code):
    """
    Encapsule le code Oz fonctionnel simple (avec declare et {Browse})
    dans un foncteur Mozart exécutable en ligne de commande.
    """
    if "functor" in user_code and "define" in user_code:
        return user_code
    
    clean_code = re.sub(r'^\s*declare\b', '', user_code, flags=re.MULTILINE)
    return f"""functor
import
   Application
   System
define
   proc {{Browse Val}}
      {{System.showInfo "Browse: " # Val}}
   end
   proc {{Show Val}}
      {{System.showInfo "Show: " # Val}}
   end
{clean_code}
   {{Application.exit 0}}
end
"""

def execute_local_code(lang, code, stdin_input=""):
    """Exécute le code avec le compilateur natif du système."""
    t_start = time.perf_counter()
    tools = detect_compilers()

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            # 1. LANGAGE C (GCC)
            if lang == 'c':
                if not tools['gcc']:
                    return {'status': 1, 'compiler_error': 'GCC non trouvé sur votre système (/usr/bin/gcc).', 'program_output': '', 'time_ms': 0}
                
                src = os.path.join(tmpdir, "main.c")
                out = os.path.join(tmpdir, "main")
                with open(src, "w", encoding="utf-8") as f:
                    f.write(code)
                
                comp = subprocess.run(["gcc", "-O2", "-Wall", src, "-o", out], capture_output=True, text=True, timeout=10)
                if comp.returncode != 0:
                    return {
                        'status': comp.returncode,
                        'compiler_error': comp.stderr,
                        'compiler_message': comp.stdout,
                        'program_output': '',
                        'program_error': '',
                        'time_ms': round((time.perf_counter() - t_start) * 1000),
                        'engine': 'local-gcc'
                    }
                
                run = subprocess.run([out], input=stdin_input, capture_output=True, text=True, timeout=8)
                return {
                    'status': run.returncode,
                    'compiler_error': comp.stderr,
                    'program_output': run.stdout,
                    'program_error': run.stderr,
                    'time_ms': round((time.perf_counter() - t_start) * 1000),
                    'engine': 'local-gcc'
                }

            # 2. PYTHON 3
            elif lang == 'python':
                if not tools['python3']:
                    return {'status': 1, 'compiler_error': 'Python 3 non trouvé sur votre système.', 'program_output': '', 'time_ms': 0}
                
                src = os.path.join(tmpdir, "main.py")
                with open(src, "w", encoding="utf-8") as f:
                    f.write(code)
                
                run = subprocess.run(["python3", "-u", src], input=stdin_input, capture_output=True, text=True, timeout=8)
                return {
                    'status': run.returncode,
                    'compiler_error': '',
                    'program_output': run.stdout,
                    'program_error': run.stderr,
                    'time_ms': round((time.perf_counter() - t_start) * 1000),
                    'engine': 'local-cpython3'
                }

            # 3. JAVA (JAVAC + JAVA)
            elif lang == 'java':
                if not tools['javac'] or not tools['java']:
                    return {'status': 1, 'compiler_error': 'JDK / javac non trouvé sur votre système.', 'program_output': '', 'time_ms': 0}
                
                match = re.search(r'class\s+([A-Za-z0-9_]+)', code)
                class_name = match.group(1) if match else "Main"
                
                if not match:
                    code = f"public class Main {{\n    public static void main(String[] args) {{\n{code}\n    }}\n}}"
                    class_name = "Main"
                
                src = os.path.join(tmpdir, f"{class_name}.java")
                with open(src, "w", encoding="utf-8") as f:
                    f.write(code)
                
                comp = subprocess.run(["javac", src], capture_output=True, text=True, timeout=12)
                if comp.returncode != 0:
                    return {
                        'status': comp.returncode,
                        'compiler_error': comp.stderr,
                        'program_output': '',
                        'program_error': '',
                        'time_ms': round((time.perf_counter() - t_start) * 1000),
                        'engine': 'local-openjdk'
                    }
                
                run = subprocess.run(["java", "-cp", tmpdir, class_name], input=stdin_input, capture_output=True, text=True, timeout=8)
                return {
                    'status': run.returncode,
                    'compiler_error': '',
                    'program_output': run.stdout,
                    'program_error': run.stderr,
                    'time_ms': round((time.perf_counter() - t_start) * 1000),
                    'engine': 'local-openjdk'
                }

            # 4. OZ (MOZART 2.0 / OZC + OZENGIINE)
            elif lang == 'oz':
                if not tools['ozc'] or not tools['ozengine']:
                    return {'status': 1, 'compiler_error': 'Compilateur Oz (ozc / ozengine) non trouvé sur votre système.', 'program_output': '', 'time_ms': 0}
                
                wrapped = wrap_oz_code(code)
                src = os.path.join(tmpdir, "prog.oz")
                out = os.path.join(tmpdir, "prog.ozf")
                with open(src, "w", encoding="utf-8") as f:
                    f.write(wrapped)
                
                comp = subprocess.run(["ozc", "-c", src, "-o", out], capture_output=True, text=True, timeout=10)
                if comp.returncode != 0:
                    return {
                        'status': comp.returncode,
                        'compiler_error': comp.stderr,
                        'program_output': '',
                        'program_error': '',
                        'time_ms': round((time.perf_counter() - t_start) * 1000),
                        'engine': 'local-mozart-oz'
                    }
                
                run = subprocess.run(["ozengine", out], input=stdin_input, capture_output=True, text=True, timeout=8)
                return {
                    'status': run.returncode,
                    'compiler_error': '',
                    'program_output': run.stdout,
                    'program_error': run.stderr,
                    'time_ms': round((time.perf_counter() - t_start) * 1000),
                    'engine': 'local-mozart-oz'
                }

            # 5. BASH
            elif lang == 'bash':
                run = subprocess.run(["bash", "-c", code], input=stdin_input, capture_output=True, text=True, timeout=8)
                return {
                    'status': run.returncode,
                    'compiler_error': '',
                    'program_output': run.stdout,
                    'program_error': run.stderr,
                    'time_ms': round((time.perf_counter() - t_start) * 1000),
                    'engine': 'local-bash'
                }

            # 6. JAVASCRIPT (NODE.JS)
            elif lang == 'javascript':
                if tools['node']:
                    run = subprocess.run(["node", "-e", code], input=stdin_input, capture_output=True, text=True, timeout=8)
                    return {
                        'status': run.returncode,
                        'compiler_error': '',
                        'program_output': run.stdout,
                        'program_error': run.stderr,
                        'time_ms': round((time.perf_counter() - t_start) * 1000),
                        'engine': 'local-node'
                    }
                else:
                    return {'status': 1, 'compiler_error': 'Node.js non trouvé en local.', 'program_output': '', 'time_ms': 0}

            else:
                return {'status': 1, 'compiler_error': f'Langage non supporté : {lang}', 'program_output': '', 'time_ms': 0}

    except subprocess.TimeoutExpired:
        return {
            'status': 124,
            'compiler_error': 'Délai d\'exécution dépassé (timeout 8s). Attention aux boucles infinies !',
            'program_output': '',
            'program_error': '',
            'time_ms': round((time.perf_counter() - t_start) * 1000)
        }
    except Exception as e:
        return {
            'status': 1,
            'compiler_error': f'Erreur système locale : {str(e)}',
            'program_output': '',
            'program_error': '',
            'time_ms': round((time.perf_counter() - t_start) * 1000)
        }


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
                # Échantillonnage pour un tracé SVG propre et performant (max 28 points)
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


class StudioHandler(http.server.SimpleHTTPRequestHandler):
    """Serveur HTTP statique + API d'exécution locale pour le dashboard."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WORKSPACE_DIR), **kwargs)

    def end_headers(self):
        # En-têtes CORS universels pour autoriser tout appel depuis le navigateur
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
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
            tools = detect_compilers()
            payload = {
                'status': 'ok',
                'engine': 'local-native',
                'message': 'Moteur d\'exécution local actif (10ms)',
                'tools': {k: bool(v) for k, v in tools.items()},
                'paths': {k: v for k, v in tools.items() if v}
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

    def do_POST(self):
        if self.path == '/api/run':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length)
                data = json.loads(body.decode('utf-8'))
                
                lang = data.get('lang', 'python')
                code = data.get('code', '')
                stdin_val = data.get('stdin', '')
                
                result = execute_local_code(lang, code, stdin_val)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # Journalisation compacte pour la console
        if any(k in args[0] for k in ('/api/run', '/api/status', '/api/market')):
            print(f"[Studio Runner] {args[0]}")
        else:
            super().log_message(format, *args)


def main():
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    tools = detect_compilers()
    
    print("\n" + "=" * 65)
    print(" ⚡ VIOLET DEV STUDIO // SERVEUR D'EXÉCUTION LOCAL (10 ms)")
    print("=" * 65)
    print(f" 🌐 Dashboard disponible sur : http://localhost:{port}")
    print(f" 📁 Dossier racine : {WORKSPACE_DIR}")
    print("\n Outils et compilateurs locaux détectés :")
    for name, path in tools.items():
        if path:
            print(f"   ✔ {name:<10} : {path}")
        else:
            print(f"   ✖ {name:<10} : non installé")
    print("=" * 65)
    print(" Prêt ! Toutes vos exécutions tournent à la vitesse de l'éclair.\n Appuyez sur Ctrl+C pour arrêter.\n")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), StudioHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[Studio Runner] Arrêt du serveur compagnon. À bientôt !")


if __name__ == '__main__':
    main()
