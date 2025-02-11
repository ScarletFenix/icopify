export default function Features() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8 text-[#3c5a99]">How Our Platform Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
            step: "1",
            title: "Buyer Registration and Account Setup",
            description: "Prospective buyers start their journey on the iCopify guest posting marketplace by registering an account. They can sign up using their email address or social media accounts like Facebook or Gmail. Once registered, they receive a confirmation email and are ready to begin accessing thousands of quality sites for guest posting."
          }, {
            step: "2",
            title: "Publisher Search and Task Assignment",
            description: "Buyers navigate through the platform's inventory to search for suitable publishers to collaborate with. They can utilize various filters to refine their search based on metrics like domain authority, domain rating, and organic traffic. After identifying preferred publishers, buyers can send direct tasks to initiate collaboration."
          }, {
            step: "3",
            title: "Task Creation and Submission",
            description: "Buyers proceed to create tasks for the selected publishers, specifying their requirements and providing URLs for promotion. They have the option to choose between Content Placement, Content Creation & Placement, and Link Insertions. Tasks are submitted immediately for publisher review."
          }, {
            step: "4",
            title: "Task Progress Monitoring and Communication",
            description: "Buyers utilize the MY ORDERS section to track the progress of their tasks and communicate directly with publishers regarding any task-related queries. Buyers can explore features like Open Offer to receive suggestions from publishers who are open to collaboration."
          }].map((item, index) => (
            <div key={index} className="border border-blue-500 rounded-lg overflow-hidden shadow-lg h-auto max-w-xs mx-auto p-6 text-center">
              <div className="bg-blue-100 text-center p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {item.step}
              </div>
              <h3 className="text-lg font-bold mb-2 text-blue-600">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-4xl font-bold mt-16 mb-8 text-[#3c5a99]">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
            img: "/White-Label-Assurance.webp",
            title: "Extensive Network Access",
            description: "Access a vast network of blogs and websites across numerous industries."
          }, {
            img: "/Comprehensive-Research.webp",
            title: "Quality Assurance Standards",
            description: "Maintain stringent editorial standards for high-quality content."
          }, {
            img: "/White-Label-Assurance.webp",
            title: "Seamless Collaboration Tools",
            description: "Streamline communication and collaboration with publishers."
          }, {
            img: "/Comprehensive-Research.webp",
            title: "Cost-Effective Solutions",
            description: "Affordable guest posting options that fit all budgets."
          }].map((item, index) => (
            <div key={index} className="border border-blue-500 rounded-lg overflow-hidden shadow-lg h-auto max-w-xs mx-auto">
              <div className="bg-blue-100 text-center p-6">
                <img src={item.img} alt="Feature" className="mx-auto w-64 h-auto" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2 text-blue-600">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
