interface SerperResult {
   title: string,
   link: string,
   position: number,
}

const serper: ScraperSettings = {
   id: 'serper',
   name: 'Serper.dev',
   website: 'serper.dev',
   allowsCity: true,
   scrapeURL: (keyword, settings, countryData) => {
      const country = keyword.country || 'US';
      const lang = countryData[country][2];

      const query = encodeURIComponent(keyword.keyword);
      const baseURL = `https://google.serper.dev/search?q=${query}&gl=${country}&hl=${lang}&num=100&apiKey=${settings.scaping_api}`;

      // Añadir location solo si hay ciudad
      const locationParam = (keyword.city)
         ? `&location=${encodeURIComponent(keyword.city + ', ' + countryData[country][0])}`
         : '';

      const url = baseURL + locationParam;

      console.log('Serper URL:', url);
      return url;
   },
   resultObjectKey: 'organic',
   serpExtractor: (content) => {
      const extractedResult = [];
      const results: SerperResult[] = (typeof content === 'string') ? JSON.parse(content) : content as SerperResult[];

      for (const { link, title, position } of results) {
         if (title && link) {
            extractedResult.push({
               title,
               url: link,
               position,
            });
         }
      }
      return extractedResult;
   },
};

export default serper;
