export class NotFoundPage {
  renderPage():HTMLDivElement {
    const notFoundPage:HTMLDivElement = document.createElement('div');
    notFoundPage.className = 'not-found-page';
    notFoundPage.textContent = 'Page not found (404)';

    return notFoundPage;
  }
}