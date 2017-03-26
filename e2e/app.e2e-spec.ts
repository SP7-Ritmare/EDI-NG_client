import { ProvaNg2Page } from './app.po';

describe('prova-ng2 App', function() {
  let page: ProvaNg2Page;

  beforeEach(() => {
    page = new ProvaNg2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
