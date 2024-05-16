import { DataTable } from "@/components/custom ui/DataTable"
// Импортируем компонент DataTable из указанного пути.

import { columns } from "@/components/orderItems/OrderItemsColums"
// Импортируем массив колонок для таблицы из указанного пути.

const OrderDetails = async ({ params }: { params: { orderId: string }}) => {
  // Определяем асинхронный компонент OrderDetails, который принимает объект params с полем orderId.

  const res = await fetch(`${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`)
  // Выполняем запрос к API для получения данных о заказе по его ID.

  const { orderDetails, customer } = await res.json()
  // Преобразуем ответ в JSON-формат и деструктурируем его на orderDetails и customer.

  const { street, city, state, postalCode, country } = orderDetails.shippingAddress
  // Деструктурируем объект shippingAddress для получения отдельных полей адреса доставки.

  return (
    // Возвращаем JSX для рендеринга информации о заказе.
    <div className="flex flex-col p-10 gap-5">
      {/* Контейнер с использованием Flexbox для вертикального расположения элементов, с отступами и промежутками */}
      <p className="text-base-bold">
        {/* Абзац с жирным текстом */}
        Order ID: <span className="text-base-medium">{orderDetails._id}</span>
        {/* Вложенный элемент span с обычным текстом для отображения ID заказа */}
      </p>
      <p className="text-base-bold">
        Customer name: <span className="text-base-medium">{customer.name}</span>
        {/* Вложенный элемент span с обычным текстом для отображения имени клиента */}
      </p>
      <p className="text-base-bold">
        Shipping address: <span className="text-base-medium">{street}, {city}, {state}, {postalCode}, {country}</span>
        {/* Вложенный элемент span с обычным текстом для отображения адреса доставки */}
      </p>
      <p className="text-base-bold">
        Total Paid: <span className="text-base-medium">${orderDetails.totalAmount}</span>
        {/* Вложенный элемент span с обычным текстом для отображения общей суммы оплаты */}
      </p>
      <p className="text-base-bold">
        Shipping rate ID: <span className="text-base-medium">{orderDetails.shippingRate}</span>
        {/* Вложенный элемент span с обычным текстом для отображения ID тарифа доставки */}
      </p>
      <DataTable columns={columns} data={orderDetails.products} searchKey="product"/>
      {/* Компонент DataTable для отображения данных о продуктах в заказе в виде таблицы. */}
    </div>
  )
}

export default OrderDetails
// Экспортируем компонент OrderDetails по умолчанию.
