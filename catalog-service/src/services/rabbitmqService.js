import amqp from 'amqplib';
import { updateStockByISBN } from './bookService.js';

let channel = null;
let connection = null;

const EXCHANGE_NAME = 'library_exchange';
const QUEUE_NAME = 'catalog_queue';

export const connectRabbitMQ = async () => {
  const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  const retries = 5;
  
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[RabbitMQ] Đang kết nối tới RabbitMQ (Lần thử ${i}/${retries}): ${rabbitUrl}`);
      connection = await amqp.connect(rabbitUrl);
      channel = await connection.createChannel();
      
      // Tạo exchange loại topic để định tuyến linh hoạt
      await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
      
      // Tạo queue nhận tin nhắn
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      
      // Bind queue với các event mượn/trả sách từ Circulation Service
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'book.borrowed');
      await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'book.returned');
      
      console.log(`[RabbitMQ] Kết nối thành công! Đang lắng nghe sự kiện trên Queue: ${QUEUE_NAME}`);
      
      // Bắt đầu lắng nghe tin nhắn
      channel.consume(QUEUE_NAME, async (msg) => {
        if (msg !== null) {
          try {
            const content = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            
            console.log(`[RabbitMQ] Nhận sự kiện [${routingKey}]:`, content);
            
            const { isbn } = content;
            
            if (!isbn) {
              console.warn('[RabbitMQ] Tin nhắn không chứa thông tin ISBN hợp lệ');
              channel.ack(msg);
              return;
            }
            
            if (routingKey === 'book.borrowed') {
              // Mượn sách -> Giảm tồn kho khả dụng đi 1
              await updateStockByISBN(isbn, -1);
            } else if (routingKey === 'book.returned') {
              // Trả sách -> Tăng tồn kho khả dụng lên 1
              await updateStockByISBN(isbn, 1);
            }
            
            channel.ack(msg); // Xác nhận đã xử lý xong tin nhắn
          } catch (err) {
            console.error('[RabbitMQ] Lỗi xử lý tin nhắn:', err.message);
            // Requeue tin nhắn nếu là lỗi tạm thời, ở đây ta từ chối và không requeue để tránh vòng lặp vô hạn
            channel.nack(msg, false, false);
          }
        }
      });
      
      // Xử lý lỗi ngắt kết nối đột ngột
      connection.on('error', (err) => {
        console.error('[RabbitMQ] Lỗi kết nối:', err.message);
        setTimeout(connectRabbitMQ, 5000);
      });
      
      connection.on('close', () => {
        console.warn('[RabbitMQ] Kết nối bị đóng. Đang thử kết nối lại sau 5s...');
        setTimeout(connectRabbitMQ, 5000);
      });
      
      return;
    } catch (error) {
      console.error(`[RabbitMQ] Không thể kết nối tới RabbitMQ (Thử lại sau 5s): ${error.message}`);
      if (i === retries) {
        console.error('[RabbitMQ] Đã thử tối đa số lần kết nối. Tiếp tục chạy mà không có RabbitMQ (Chế độ offline).');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
};

export const getChannel = () => channel;
