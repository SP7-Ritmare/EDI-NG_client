import { ProvaNG2Page } from './app.po';

describe('prova-ng2 App', function() {
  let page: ProvaNG2Page;

  beforeEach(() => {
    page = new ProvaNG2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
