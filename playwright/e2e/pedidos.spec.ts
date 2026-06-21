import { test, expect } from '@playwright/test';
import { generateOrderCode } from '../support/helpers';

test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({ page }) => {
    //Arrange
    await page.goto('http://localhost:5173/');
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

    await page.getByRole('link', { name: 'Consultar Pedido' }).click();
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido');
  })

  test('Deve consultar um pedido aprovado', async ({ page }) => {
    //Test Data
    const orderCode = 'VLO-GIU6SK';

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderCode);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    //Assert
/*     const containerPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..'); //Sobe para o elemento pai do texto "Pedido"

    await expect(containerPedido).toContainText(orderCode, { timeout: 10000 });

    await expect(page.getByText('APROVADO')).toBeVisible(); */


    await expect(page.getByTestId(`order-result-${orderCode}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${orderCode}
      - img
      - text: APROVADO
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: Lunar White
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: Marcos Viana
      - paragraph: Email
      - paragraph: veniqa@gmail.com
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: À Vista
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

  });

  test('Deve exibir mensagem de erro ao buscar um pedido não encontrado', async ({ page }) => {
    const orderCode = generateOrderCode();

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderCode);
    await page.getByRole('button', { name: 'Buscar Pedido' }).click();

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);

  })

});

