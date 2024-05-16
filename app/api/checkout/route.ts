import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

import { stripe } from "@/lib/stripe";
// Импортируем инициализированный экземпляр Stripe из указанного пути.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
// Определяем заголовки CORS для разрешения запросов из любого источника и различных методов HTTP.

export async function OPTIONS() {
  // Определяем функцию для обработки OPTIONS-запросов.
  return NextResponse.json({}, { headers: corsHeaders });
  // Возвращаем пустой ответ с заголовками CORS.
}

export async function POST(req: NextRequest) {
  // Определяем асинхронную функцию для обработки POST-запросов.
  try {
    const { cartItems, customer } = await req.json();
    // Извлекаем cartItems и customer из тела запроса.

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
      // Возвращаем ошибку 400, если cartItems или customer отсутствуют.
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // Указываем типы платежных методов (только карты).

      mode: "payment",
      // Устанавливаем режим платежа.

      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      // Указываем разрешенные страны для адреса доставки.

      shipping_options: [
        { shipping_rate: "shr_1MfufhDgraNiyvtnDGef2uwK" },
        { shipping_rate: "shr_1OpHFHDgraNiyvtnOY4vDjuY" },
      ],
      // Определяем доступные варианты доставки.

      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      // Формируем данные о товарах в корзине для сессии оплаты.

      client_reference_id: customer.clerkId,
      // Указываем идентификатор клиента.

      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      // URL, на который перенаправляется пользователь после успешной оплаты.

      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
      // URL, на который перенаправляется пользователь при отмене оплаты.
    });

    return NextResponse.json(session, { headers: corsHeaders });
    // Возвращаем созданную сессию оплаты с заголовками CORS.
  } catch (err) {
    console.log("[checkout_POST]", err);
    // Логируем ошибку при создании сессии оплаты.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
}
