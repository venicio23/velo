import { test, expect } from '@playwright/test';

test('Deve consultar um pedido aprovado', async ({ page }) => {
  //Test Data
  const orderCode = 'VLO-GIU6SK';

  //Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  //Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderCode);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Assert
  const containerPedido = page.getByRole('paragraph')
  .filter({ hasText: /^Pedido$/ })
  .locator('..'); //Sobe para o elemento pai do texto "Pedido"

  await expect(containerPedido).toContainText(orderCode, { timeout: 10000 }	);  

  await expect(page.getByText('APROVADO')).toBeVisible();

});

test('Deve exibir mensagem de erro ao buscar um pedido não encontrado', async ({ page }) => {
  const orderCode =  'VLO-ABC123';

  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderCode);
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  const title = page.getByRole('heading', { name: 'Pedido não encontrado' });
  await expect(title).toBeVisible();

  const message = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' });
  await expect(message).toBeVisible();
  
})