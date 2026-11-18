// Service de flux RSS natif pour Violet Cockpit
// Permet d'agréger les actualités sans aucune restriction CORS

export const PRESET_FEEDS = {
  tech: {
    id: 'tech',
    name: 'Hacker News (Tech)',
    url: 'https://news.ycombinator.com/rss',
    category: 'Tech',
    icon: '⚡',
  },
  numerama: {
    id: 'numerama',
    name: 'Numerama (Tech & Futur)',
    url: 'https://www.numerama.com/feed/',
    category: 'Tech',
    icon: '🚀',
  },
  lesoir: {
    id: 'lesoir',
    name: 'Le Soir (Actu & Belgique)',
    url: 'https://www.lesoir.be/rss2/2/cible_principale',
    category: 'Actualités',
    icon: '📰',
  },
  lemonde: {
    id: 'lemonde',
    name: 'Le Monde (À la une)',
    url: 'https://www.lemonde.fr/rss/une.xml',
    category: 'Actualités',
    icon: '🌍',
  },
  f1: {
    id: 'f1',
    name: 'L\'Équipe (Formule 1)',
    url: 'https://dwh.lequipe.fr/api/edito/rss?path=/Formule-1/',
    category: 'Sport',
    icon: '🏎️',
  },
};

const CACHE_TTL_MS = 600 * 1000; // 10 minutes

class RSSService {
  constructor() {
    this.cache = new Map();
  }

  cleanHtml(html) {
    if (!html) return '';
    return html
      .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  extractTag(xml, tag) {
    const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
    const cdataMatch = xml.match(cdataRegex);
    if (cdataMatch) return cdataMatch[1].trim();

    const standardRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(standardRegex);
    return match ? match[1].trim() : '';
  }

  parseXmlFeed(xml, feedName) {
    const items = [];
    const itemBlocks = xml.match(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi) || [];

    for (const block of itemBlocks.slice(0, 15)) {
      let title = this.extractTag(block, 'title');
      let link = this.extractTag(block, 'link');

      // Si le lien est dans un attribut href="...", ex: Atom feeds
      if (!link) {
        const hrefMatch = block.match(/href=["'](https?:\/\/[^"']+)["']/i);
        if (hrefMatch) link = hrefMatch[1];
      }

      let pubDate = this.extractTag(block, 'pubDate') || this.extractTag(block, 'updated') || this.extractTag(block, 'dc:date');
      let description = this.extractTag(block, 'description') || this.extractTag(block, 'summary');

      title = this.cleanHtml(title);
      description = this.cleanHtml(description);
      if (description.length > 180) {
        description = description.substring(0, 180) + '...';
      }

      let dateFormatted = '';
      if (pubDate) {
        try {
          const d = new Date(pubDate);
          if (!isNaN(d.getTime())) {
            dateFormatted = d.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });
          }
        } catch (_) {}
      }

      if (title && link) {
        items.push({
          title,
          link,
          source: feedName,
          date: dateFormatted || pubDate,
          description: description || 'Consulter l\'article complet sur le site.',
        });
      }
    }

    return items;
  }

  async fetchFeed(feedKey = 'tech') {
    const preset = PRESET_FEEDS[feedKey];
    const url = preset ? preset.url : feedKey;
    const feedName = preset ? preset.name : 'Flux RSS';

    const now = Date.now();
    const cached = this.cache.get(url);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return { status: 'ok', cached: true, items: cached.data };
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/rss+xml, application/xml, text/xml; q=0.9, */*; q=0.8',
        },
      });

      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const items = this.parseXmlFeed(text, feedName);

      if (items.length > 0) {
        this.cache.set(url, { timestamp: now, data: items });
        return { status: 'ok', cached: false, items };
      }
      throw new Error('Aucun article trouvé dans le flux');
    } catch (err) {
      console.warn(`[RSS] Erreur fetch pour ${feedKey}:`, err.message);
      // Fallback
      if (cached) {
        return { status: 'ok', cached: true, fallback: true, items: cached.data };
      }
      return {
        status: 'error',
        message: err.message,
        items: this.getFallbackItems(feedName),
      };
    }
  }

  getFallbackItems(feedName) {
    return [
      {
        title: 'Violet Cockpit 5.2 : Nouvelle architecture modulaire sous Electron',
        link: 'https://github.com',
        source: feedName,
        date: 'Aujourd\'hui',
        description: 'Mise en place de la passerelle native fluide et des 5 thèmes graphiques cyberpunk et verre dépoli.',
      },
      {
        title: 'Exploration des architectures d\'interfaces sans framework lourd',
        link: 'https://github.com',
        source: feedName,
        date: 'Hier',
        description: 'Vite 6 + Vanilla JS pour un temps de démarrage inférieur à 200ms à 60 FPS.',
      },
    ];
  }
}

export default RSSService;
