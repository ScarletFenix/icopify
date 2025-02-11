import { FaStar } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Gary G.",
      image: "https://storage.googleapis.com/a1aa/image/G7OvsTyGnRB8pA00zl3OfH8ZdPUsiuJvbhlBFKwvQpM.jpg",
      feedback: "Being a startup company, we were very pleased with the performance and ranking results delivered through iCopify platform. We were able to achieve quality backlinks & branded guest blogs on our website in a relatively short period of time. The team has been very responsive in addressing any type of query.",
    },
    {
      name: "David R.",
      image: "https://storage.googleapis.com/a1aa/image/mtYDNhvizyPJa7RlB92M-8xq2GCMUJlPDx920qZ5Wvs.jpg",
      feedback: "The work of an SEO manager is an ongoing process with lots of ups & downs. But, since I have been associated with iCopify, my SEO procedures have become very seamless. Getting sponsored articles along with the highest level of transparency and professionalism has been the biggest benefit.",
    },
    {
      name: "Michaela W.",
      image: "https://storage.googleapis.com/a1aa/image/FrXIG9PbUZmjg4amQ1sSJ7usrCNSC1BDLm0PYJMKRxI.jpg",
      feedback: "Being a marketeer, I understand the importance of content marketing strategy and getting relevant content placed on the website. I have had a great experience working with iCopify as it helped me connect with professionals who could provide me cost-effective & top-notch content.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-[#EFF6FF]">
      <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-8">
        Here's What Our Clients Say
      </h2>
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-center mb-4">
              <img
                src={testimonial.image}
                alt={`Avatar of ${testimonial.name}`}
                className="rounded-full" 
                width="100"
                height="100"
              />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              {testimonial.name}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {testimonial.feedback}
            </p>
            <div className="flex justify-center text-orange-500 text-lg mt-2">
              {[...Array(5)].map((_, starIndex) => (
                <FaStar key={starIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
