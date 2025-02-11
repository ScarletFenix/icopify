import CountUp from 'react-countup';

export default function StatsSection() {
  return (
    <section className="py-3 bg-[#0B1727] shadow-md w-full overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-wrap justify-evenly items-center text-center text-white w-full">
          <div className="w-full md:w-1/3 xl:w-auto mb-2 px-4">
            <span className="text-2xl font-bold text-white">
              <CountUp end={49843} duration={1} separator="," />
            </span>
            <strong className="text-2xl text-white">+</strong>
            <br />
            <span className="text-lg font-semibold">Registered Websites</span>
          </div>
          <div className="w-full md:w-1/3 xl:w-auto mb-2 px-4">
            <span className="text-2xl font-bold text-white">
              <CountUp end={31085} duration={1} separator="," />
            </span>
            <strong className="text-2xl text-white">+</strong>
            <br />
            <span className="text-lg font-semibold">Publishers & Writers</span>
          </div>
          <div className="w-full md:w-1/3 xl:w-auto mb-2 px-4">
            <span className="text-2xl font-bold text-white">
              <CountUp end={282592} duration={1} separator="," />
            </span>
            <strong className="text-2xl text-white">+</strong>
            <br />
            <span className="text-lg font-semibold">Tasks Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
}