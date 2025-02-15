import { logo } from "../assets";
import styles from "../style";
const About = () => {
  return (
    <div
      className={`${styles.paddingY} bg-white-gradient  rounded-lg p-4 mb-4`}
    >
      <div className={`${styles.flexCenter} flex-col text-center`}>
        <img
          src={logo}
          alt="ParkEase Logo"
          className="w-[150px] md:w-[200px] h-auto mb-4"
        />
        <h1 className={`${styles.heading2} text-gradient`}>
          Welcome to ParkEase
        </h1>
        <div className=" bg-gray-200 shadow-md rounded-lg mt-4 p-4">
          <div className=" text-gray-800 text-4xl font-bold tracking-widest">
            Your Parking Solution
          </div>
        </div>
        <p className={`${styles.paragraph} mt-6`}>
          At ParkEase, we believe parking should be hassle-free. Our app
          connects you to available parking spots tailored to your needs,
          ensuring convenience and peace of mind. Join us in transforming your
          parking experience!
        </p>
      
      </div>
    </div>
  );
};

export default About;
