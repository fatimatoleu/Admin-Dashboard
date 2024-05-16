import { SignUp } from "@clerk/nextjs";

// Импортируем компонент SignUp из библиотеки @clerk/nextjs. 
// Этот компонент используется для отображения формы регистрации.

export default function Page() {
  return (
    // Определяем компонент Page как функцию, которая возвращает JSX.
    <div className="h-screen flex justify-center items-center">
      // Создаем контейнер div, который занимает всю высоту экрана (h-screen) 
      // и использует Flexbox для центрирования содержимого как по горизонтали, так и по вертикали (flex justify-center items-center).
      <SignUp />
      // Внутри контейнера div размещаем компонент SignUp, который отображает форму регистрации.
    </div>
  );
}
