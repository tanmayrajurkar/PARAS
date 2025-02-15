import { Link } from "react-router-dom";
import styles from "../../style";
import { parking } from "../../assets";
import { GetStarted } from "../index";
const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100px] leading-[75px]">
            Future of <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Parking</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            <Link to="/listbookings">
              <GetStarted />
            </Link>
          </div>
        </div>
        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100px] leading-[75px] w-full">
          ParkEase
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          We use a method to find the parking spots that fit your needs.
        </p>
      </div>
      <div
        className={`flex flex-1 ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <img
          src={parking}
          alt="parking"
          className="w-[100%]h-[100%] relative z-[5] p-2 rounded-3xl"
        />

        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient"></div>
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full bottom-30 white__gradient"></div>
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient"></div>
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <Link to="/listbookings">
          <GetStarted />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
