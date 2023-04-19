export class NotFoundPage {
    renderPage() {
        const notFoundPage=document.createElement('div');
        notFoundPage.className='not-found-page';
        notFoundPage.textContent='Page not found (404)';

        return notFoundPage;
    }
}