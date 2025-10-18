// utils/printUtils.ts

// A interface 'Sale' precisa ser definida ou importada aqui
interface Sale {
  id: string;
  customerName: string;
  date: string;
  status: "Pendente" | "Processando" | "Enviado" | "Cancelado";
  total: number;
  products: { name: string; quantity: number; price: number }[];
  address: { street: string; number: string; city: string; state: string; zip: string };
}

/**
 * Gera e imprime uma etiqueta de envio com QR Code para um pedido específico.
 * @param sale O objeto do pedido de venda.
 */
export function handleGenerateShippingLabel(sale: Sale) {
  const storeAddress = {
    name: "Solucell",
    street: "R. Melo Franco",
    number: "216",
    city: "Vespasiano",
    state: "MG", // Assumi MG com base no CEP 33206-072
    zip: "33206-072"
  };

  // Conteúdo do QR Code: em um cenário real, seria uma URL de rastreamento.
  // Exemplo: `https://sua-loja.com/rastreio?pedido=${sale.id}`
  const qrData = `Detalhes do Pedido: ${sale.id} | Cliente: ${sale.customerName} | Acesse: https://sua-loja.com/rastreio/${sale.id}`;

  const labelContent = `
    <html>
      <head>
        <title>Etiqueta de Envio #${sale.id}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          body { 
            font-family: 'Poppins', sans-serif; 
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh; /* Ajustado para lidar com conteúdo maior */
            margin: 0;
            background-color: #f0f0f0; /* Fundo suave para visualização */
          }
          .shipping-label {
            width: 90mm; /* Largura padrão para etiquetas (ex: Zebra) */
            height: 140mm; /* Altura padrão para etiquetas */
            border: 1px solid #000;
            padding: 8mm 10mm; /* Mais espaçamento interno */
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 10pt;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .label-section {
            padding-bottom: 5mm;
            border-bottom: 1px dashed #ccc; /* Linha mais suave */
            margin-bottom: 5mm;
          }
          .label-section:last-of-type { /* Remove a borda da última seção */
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
          }
          
          .label-header { 
            text-align: center;
            margin-bottom: 8mm; /* Mais espaço no cabeçalho */
          }
          .label-header h1 { 
            font-size: 16pt; 
            margin: 0 0 3px 0; 
            color: #333;
          }
          .label-header p { 
            font-size: 9pt; 
            margin: 0; 
            color: #555;
            line-height: 1.3;
          }

          .label-info h2 { 
            font-size: 11pt; 
            margin: 0 0 4px; 
            color: #222;
            font-weight: 600;
          }
          .label-info p { 
            margin: 0; 
            line-height: 1.4;
          }
          .label-info strong { 
            display: block; 
            margin-top: 2px; 
            font-size: 10.5pt;
            color: #000;
          }

          .label-qrcode { 
            text-align: center; 
            display: flex; /* Para centralizar o QR */
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-top: 5mm;
          }
          .label-qrcode #qrcode {
            padding: 5px; /* Espaço ao redor do QR */
            border: 1px solid #eee;
            background-color: #fff;
            margin-bottom: 5px;
          }
          .label-qrcode p {
            font-size: 9pt;
            color: #666;
            margin: 0;
          }

          @media print {
            body { 
              all: unset; /* Reseta todos os estilos do corpo para impressão */
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              display: block; /* Remove flex para evitar problemas de layout de impressão */
            }
            .shipping-label { 
              width: 90mm; 
              height: 140mm;
              border: 1px solid #000 !important; /* Força borda para impressão */
              box-shadow: none !important; /* Remove sombra na impressão */
              page-break-after: always; /* Garante que cada etiqueta esteja em uma página separada se houver múltiplas */
            }
            .label-section {
               border-bottom: 1px dashed #999; /* Linha para impressão */
            }
            .label-section:last-of-type {
              border-bottom: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="shipping-label">
          <div class="label-section label-header">
            <h1>${storeAddress.name}</h1>
            <p>${storeAddress.street}, ${storeAddress.number} - ${storeAddress.city}/${storeAddress.state}</p>
            <p>CEP: ${storeAddress.zip}</p>
          </div>
          
          <div class="label-section label-info">
            <h2>Remetente:</h2>
            <p><strong>${storeAddress.name}</strong></p>
            <p>${storeAddress.street}, ${storeAddress.number}</p>
            <p>${storeAddress.city}/${storeAddress.state}, CEP: ${storeAddress.zip}</p>
          </div>

          <div class="label-section label-info">
            <h2>Destinatário:</h2>
            <p><strong>${sale.customerName}</strong></p>
            <p>${sale.address.street}, ${sale.address.number}</p>
            <p>${sale.address.city}/${sale.address.state}, CEP: ${sale.address.zip}</p>
          </div>
          
          <div class="label-section label-qrcode">
            <div id="qrcode"></div> 
            <p>ID do Pedido: ${sale.id}</p>
          </div>
        </div>

        <script>
          // O QR Code será desenhado dentro da div 'qrcode'
          var qrcode = new QRCode(document.getElementById("qrcode"), {
            text: "${qrData}",
            width: 100, // Tamanho do QR Code
            height: 100,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L
          });
          
          // Adiciona um pequeno atraso antes de imprimir para garantir que o QR Code seja renderizado
          setTimeout(() => {
            window.print();
          }, 500); // 500ms de atraso
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=378,height=567');
  if (printWindow) {
    printWindow.document.write(labelContent);
    printWindow.document.close();
    // É importante focar a janela antes de tentar imprimir
    printWindow.focus(); 
  }
}