import { useState} from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { slides } from "../../constants";

export default function Carousel({
  data
}) {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));


  return (
    <div className="overflow-hidden relative h-40 w-100 lg:w-2/3 rounded-lg mx-auto">
      <div className="absolute top-0 left-0 right-0 p-4 text-gray-100 text-center z-10">
        <p className="font-bold text-lg">{data.name}</p>
        <p className="font-semibold">Rs {data.price_per_hour}/hr</p>
      </div>
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((s, index) => (
          <img key={index} src={s} className="object-contain h-60 w-100  lg:w-full" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <ChevronLeft size={40} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`
              transition-all w-3 h-3 bg-white rounded-full
              ${curr === i ? "p-2" : "bg-opacity-50"}
            `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
