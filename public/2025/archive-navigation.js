(() => {
  const archiveLinks = [
    { label: 'DevFest 2025', href: '/2025' },
    { label: 'DevFest 2024', href: 'https://devfest24.gdg-sdc.org/' },
    { label: 'DevFest 2023', href: 'https://devfest23.gdg-sdc.org/' }
  ];

  const addEditionNavigation = () => {
    document
      .querySelectorAll('a[href*="devfest24.gdg-sdc.org"]')
      .forEach(previousEditionLink => {
        if (previousEditionLink.dataset.editionMenu === 'true') return;

        const currentEditionLink = document.createElement('a');
        currentEditionLink.href = '/';
        currentEditionLink.className = 'archive-current-edition';
        currentEditionLink.setAttribute('aria-current', 'page');
        currentEditionLink.textContent = 'DevFest 2026';

        const editions = document.createElement('details');
        editions.className = 'archive-editions';
        const summary = document.createElement('summary');
        summary.textContent = 'Otras ediciones';
        summary.setAttribute('aria-label', 'Otras ediciones');

        const list = document.createElement('div');
        list.className = 'archive-editions-list';
        archiveLinks.forEach(({ label, href }) => {
          const link = document.createElement('a');
          link.href = href;
          link.textContent = label;
          list.append(link);
        });

        editions.append(summary, list);
        previousEditionLink.replaceWith(currentEditionLink, editions);
      });
  };

  addEditionNavigation();
  new MutationObserver(addEditionNavigation).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
