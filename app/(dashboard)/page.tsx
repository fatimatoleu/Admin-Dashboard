import SalesChart from "@/components/custom ui/SalesChart";
// Импортируем компонент SalesChart из указанного пути.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Импортируем компоненты Card, CardContent, CardHeader и CardTitle из указанного пути.

import { Separator } from "@/components/ui/separator";
// Импортируем компонент Separator из указанного пути.

import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
// Импортируем функции getSalesPerMonth, getTotalCustomers и getTotalSales из указанного пути.

import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
// Импортируем иконки CircleDollarSign, ShoppingBag и UserRound из библиотеки lucide-react.

export default async function Home() {
  // Определяем асинхронный компонент Home.

  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  // Получаем общую выручку с помощью функции getTotalSales и извлекаем значение totalRevenue из полученных данных.

  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  // Получаем общее количество заказов с помощью функции getTotalSales и извлекаем значение totalOrders из полученных данных.

  const totalCustomers = await getTotalCustomers();
  // Получаем общее количество клиентов с помощью функции getTotalCustomers.

  const graphData = await getSalesPerMonth();
  // Получаем данные для графика продаж по месяцам с помощью функции getSalesPerMonth.

  return (
    // Возвращаем JSX для рендеринга главной страницы панели управления.
    <div className="px-8 py-10">
      {/* Контейнер для содержимого с отступами по осям X и Y */}
      <p className="text-heading2-bold">Dashboard</p>
      {/* Заголовок страницы */}
      <Separator className="bg-grey-1 my-5" />
      {/* Разделитель между заголовком и содержимым */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        {/* Контейнер с использованием CSS Grid для размещения карточек с информацией */}
        
        <Card>
          {/* Карточка для отображения общей выручки */}
          <CardHeader className="flex flex-row justify-between items-center">
            {/* Заголовок карточки с использованием Flexbox для выравнивания элементов */}
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
            {/* Иконка, скрытая на маленьких экранах */}
          </CardHeader>
          <CardContent>
            {/* Содержимое карточки */}
            <p className="text-body-bold">$ {totalRevenue}</p>
            {/* Отображение общей выручки */}
          </CardContent>
        </Card>

        <Card>
          {/* Карточка для отображения общего количества заказов */}
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
            {/* Иконка, скрытая на маленьких экранах */}
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
            {/* Отображение общего количества заказов */}
          </CardContent>
        </Card>

        <Card>
          {/* Карточка для отображения общего количества клиентов */}
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customer</CardTitle>
            <UserRound className="max-sm:hidden" />
            {/* Иконка, скрытая на маленьких экранах */}
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
            {/* Отображение общего количества клиентов */}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        {/* Карточка для отображения графика продаж */}
        <CardHeader>
          <CardTitle>Sales Chart ($)</CardTitle>
          {/* Заголовок графика продаж */}
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
          {/* Компонент SalesChart для отображения графика продаж с данными graphData */}
        </CardContent>
      </Card>
    </div>
  );
}
