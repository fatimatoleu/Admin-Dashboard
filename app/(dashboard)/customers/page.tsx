import { DataTable } from '@/components/custom ui/DataTable'
// Импортируем компонент DataTable из указанного пути.

import { columns } from '@/components/customers/CustomerColumns'
// Импортируем массив колонок для таблицы из указанного пути.

import { Separator } from '@/components/ui/separator'
// Импортируем компонент Separator из указанного пути.

import Customer from '@/lib/models/Customer'
// Импортируем модель Customer из указанного пути.

import { connectToDB } from '@/lib/mongoDB'
// Импортируем функцию connectToDB из указанного пути.

const Customers = async () => {
  // Определяем асинхронный компонент Customers.
  await connectToDB()
  // Подключаемся к базе данных.

  const customers = await Customer.find().sort({ createdAt: "desc" })
  // Выполняем запрос к базе данных для получения всех клиентов, отсортированных по дате создания в порядке убывания.

  return (
    <div className='px-10 py-5'>
      {/* Контейнер для содержимого с отступами по осям X и Y */}
      <p className='text-heading2-bold'>Customers</p>
      {/* Заголовок страницы */}
      <Separator className='bg-grey-1 my-5' />
      {/* Разделитель между заголовком и таблицей */}
      <DataTable columns={columns} data={customers} searchKey='name'/>
      {/* Компонент DataTable для отображения данных о клиентах в виде таблицы. */}
    </div>
  )
}

export const dynamic = "force-dynamic"
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.

export default Customers
// Экспортируем компонент Customers по умолчанию.
