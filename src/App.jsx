import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API
// This is a complete, self-contained App component that can be used in any React project.
// It assumes that Tailwind CSS and Framer Motion are already installed and configured.
// To install them, run: npm install tailwindcss framer-motion
const App = () => {
  const today = new Date();

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "/EurekaLandingPage.png", "/Eureka Dark theme.png", "EurekaTestiMonialsection.png"
    , "/EurekaFeedbackPage.png", "/EurekaPricingSection.png"
    , "EurekaSignupPage.png", "/DevPortfolio.jpg", "/MendAI.png", "/Surge.png", "/Surge2.png", "/Yibee.png",
  ];


  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm an AI assistant for Ayush. I can tell you about his projects, skills, and experience. What would you like to know?",
      sender: 'ai',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  // Animation variants for staggered hero text reveal.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual hero text elements.
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Project data to map over and display. This is used for context in the AI chatbot prompt.
  const projects = [
    {
      title: 'Eureka - AI Research Platform',
      img: "/EurekaLandingPage.png",
      description: 'An AI research assistant enabling users to query context-aware bots trained on verified documents. It features a user reputation system and real-time, multi-user collaboration.',
      tech: ['React', 'Next.js', 'Tailwind', 'GenAI', 'RAG', 'Pinecone', 'PostgreSQL','langchain','websockets'],
      github: 'https://github.com/Ayushgairola6/Eureka',
      link: 'https://eureka-six-eta.vercel.app'

    },
    {
      title: 'MendAI - AI Companion',
      img: "/MendAI.png",
      description: 'A full-stack GenAI chatbot with a RAG and memory system, implementing freemium user tiering and prompt-tuned context logic.',
      tech: ['React Native', 'React.js', 'Node.js', 'PostgreSQL', 'GenAI', 'Qdrant', 'Neo4j','websockets'],
      github: 'https://github.com/Ayushgairola6/MendAI',
      link: 'https://mendai.netlify.app'

    },
    {
      title: 'Surge - Social Platform',
      img: "/Surge.png",
      description: 'A social networking platform for taboo discussions, including an AI post summarizer.',
      tech: ['Next.js', 'Express.js', 'GenAI', 'Tailwind', 'Redis','websockets',],
      github: 'https://github.com/Ayushgairola6/Surge',
      link: 'https://surge-lake.vercel.app'

    },
    {
      title: 'Yibee - Social + Music Streaming platform',
      img: "/Yibee.png",
      description: 'A social networking platform only for music lovers to express intense emotions they feel when they listen to a particular song',
      tech: ['React', 'Express.js', 'Firebase', 'Tailwind', 'Redis','mongodb','Auth'],
      github: 'https://github.com/Ayushgairola6/YIBEE-frontend',
      link: 'https://yibee-frontend.vercel.app'
    },
    {
      title: 'LuvLense - Dating App',
      img: "/Luvlense.png",
      description: 'The backend for a dating app with JWT authentication, matching logic, and real-time chat via Socket.IO. It uses PostgreSQL to store user actions and manage notifications.',
      tech: ['Node.js', 'Express.js', 'websockets', 'SQL','Auth','React','Tailwind'],
      github: 'https://github.com/Ayushgairola6/DemoRepo',
      link: "https://luvlense.com"
    },
  ];
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const skills = {
    languages: ['JavaScript', 'TypeScript', 'SQL', 'C++', "Python"],
    frontend: ['React', 'Next.js', 'Tailwind CSS', 'Redux-toolkit', 'zustand', 'Framer', 'ShadcnUI'],
    backend: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO'],
    databases: ['PostgreSQL', 'MongoDB', 'Redis', 'NeonDb', 'Qdrant', 'pinecone', 'Supbase', "Firebase"],
    aiGenai: ['RAG pipelines', 'memory architecture', 'prompt engineering'],
    tools: ['Postman', 'Git', 'Netlify', 'Vercel', 'Render', 'Figma', 'Docker'],
  };

  const experience = [{
    role: 'Founder and Engineer - Eureka.tech',
    duration: 'July 2025 -currently',
    description: 'A revolutionary way to study and learn things with verified sources and trusted people and the power of AI , reducing each study session time from 1hour to 30mins',
  },
  {
    role: 'Team Lead and Lead backend developer - ExtendedLeafs.Inc',
    description: 'Built the complete backend system of LuvLense.com from Auth ,websockets , notification systems and profile matching algorithms.',
  },
  {
    role: 'Full Stack Intern - NovaNectar',
    description: 'Delivered frontend modules and socket events. Completed a major part of Sprint 1.',
  },
  ];

  // Function to handle sending a message to the chatbot.
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Create a context prompt for the Gemini API using the resume data.
      const contextPrompt = `
        You are an AI assistant designed to answer questions about a Me full-stack product developer and UI/UX designer named Ayush Gairola.
        Use the following information to answer user questions about his skills, projects, experience share their linnks as well if you have them , keep the response very short not too long , act like you are talking as a personal secretary of mine the response shall not be larger than 3-7 lines , do not use explicit language you can use your own knowledge to praise the skills and why they are good .
        When user asks about a specific thing only then you need to resply about it else not , like if a user asks what tech does he (ayush/me) uses to build frontend , you can reply with - Ayush uses react and next js like widely used technologies for seamless ans smooth product building.


        **Skills:**
        - Languages: ${skills.languages.join(', ')}
        - Frontend: ${skills.frontend.join(', ')}
        - Backend: ${skills.backend.join(', ')}
        - Databases: ${skills.databases.join(', ')}
        - AI/GenAI: ${skills.aiGenai.join(', ')}
        - Tools: ${skills.tools.join(', ')}

        **Experience:**
        ${experience.map(exp => `- ${exp.role} (${exp.duration}): ${exp.description}`).join('\n')}

        **Projects:**
        ${projects.map(proj => `- ${proj.title}: ${proj.description} (Tech: ${proj.tech.join(', ')})`).join('\n')}

        ---
        Based on the above, respond to the user's question: "${inputMessage}"
      `;
      let chatHistory = [{ role: "user", parts: [{ text: contextPrompt }] }];
      const payload = { contents: chatHistory };
      const apiKey = GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setMessages((prevMessages) => [...prevMessages, { text, sender: 'ai' }]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: "I'm sorry, I couldn't generate a response. Please try again.", sender: 'ai' }]);
      } ``
    } catch (error) {
      console.error("API call failed:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "An error occurred. Please check the console for details.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to the bottom of the chat window on new messages.
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  return (
    <div className="bg-[#121212] min-h-screen text-gray-100 font-inter antialiased asimovian-regular">
      {/* Header with Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#121212]/90 backdrop-blur-md "
      >
        <div className="text-xl tracking-wider ">Ayush.</div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium josefin-sans">
          <a href="#hero" className="hover:text-cyan-400 transition-colors">Home</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-100 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}

      <motion.nav
        animate={{ opacity: isMenuOpen ? 100 : 0, y: isMenuOpen ? 0 : 130, rotate: isMenuOpen ? 0 : 40 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "circInOut" }}
        className={`josefin-sans md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-br from-gray-900 to-black border-r border-indigo-400 shadow-lg p-4 z-40 rounded-tr-full w-45 flex items-start justify-center flex-col`}
      >
        <a onClick={() => setIsMenuOpen(false)} href="#hero" className="block py-2 text-center text-gray-300 hover:text-cyan-400">Home</a>
        <a onClick={() => setIsMenuOpen(false)} href="#projects" className="block py-2 text-center text-gray-300 hover:text-cyan-400">Projects</a>
        <a onClick={() => setIsMenuOpen(false)} href="#contact" className="block py-2 text-center text-gray-300 hover:text-cyan-400">Contact</a>
      </motion.nav>


      <main className="relative container mx-auto px-6 pt-24">

        <div className='flex flex-col md:flex-row items-center justify-evenly'>
          {/* Hero Section */}
          <section id="hero" className="min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <motion.p variants={textVariants} className="text-lg text-cyan-400 mb-2 josefin-sans">
                Hello, I'm Ayush Gairola
              </motion.p>
              <motion.h1 variants={textVariants} className="text-6xl md:text-8xl font-extrabold tracking-tight mb-4 leading-tight asimovian-regular">
                A Product Developer <br />+ Designer
              </motion.h1>
              <motion.p variants={textVariants} className="max-w-2xl text-xl text-gray-400 mb-8 josefin-sans">
                Building scalable applications with a focus on MVP's, real-time systems and GenAI features like RAG and Context aware AI agents.
              </motion.p>
              <motion.a
                variants={textVariants}
                href="#projects"
                className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-cyan-500 transition-discrete duration-300 transform hover:scale-105 josefin-sans"
              >
                See My Projects {"-->"}
              </motion.a>
            </motion.div>
          </section>
          <div className='h-100 cursor-grab hidden md:block border border-cyan-600 rounded-full'>
            <img className='rounded-full h-full w-full object-contain' src="/MyImg.png" alt="" />
          </div>
        </div>


        {/* Projects Section */}
        <section id="projects" className="py-20">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            My Work
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-grab bg-gradient-to-br from-black/80 to-white/10 p-6 rounded-2xl shadow-xl border border-gray-700 hover:border-indigo-400 transition-discrete duration-300"
              >
                <div>
                  <img className='rounded-lg' src={project.img} alt={project.img} />
                </div>
                <h3 className="text-2xl font-semibold text-cyan-400 my-4 ">{project.title}</h3>
                <p className="text-gray-400 mb-4 josefin-sans">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="bg-emerald-700 flex items-center justify-center text-xs px-3 py-1 rounded-full text-gray-300 josefin-sans">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className='flex items-center justify-between flex-wrap gap-2'>
                  <a href={project.github} className="text-gray-300 text-sm hover:text-cyan-400 transition-colors flex items-center group">
                    View Project on GitHub
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </a>
                  <a href={project.link} className=" text-emerald-700 group-hover:animate-pulse text-sm px-2 py-1 rounded-lg group hover:text-teal-500 transition-colors duration-150">
                    Live Preview
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200 -rotate-45">→</span>
                  </a>
                </div>

              </motion.div>
            ))}
          </div>
        </section>
        {/* Desing caraousel section */}
        <div className="relative md:w-full  mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-center mb-12"
          >
            UI/UX Designs
          </motion.h2>
          <div className="relative w-full h-60 md:h-[97vh] overflow-hidden rounded-lg shadow-lg">
            <AnimatePresence initial={false} custom={currentIndex}>
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`Carousel image ${currentIndex + 1}`}
                custom={currentIndex}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute top-0 left-0 w-full h-full object-contain"
              />
            </AnimatePresence>

          </div>

          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 z-10"
          >
            &#10094;
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 z-10"
          >
            &#10095;
          </button>
        </div>
        {/* Contact Section */}
        <section id="contact" className="py-20 text-center ">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Let's build something great.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-8 josefin-sans"
          >
            I'm currently available for freelance projects. Feel free to reach out to me!
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            href="mailto:ayushgairola2002@gmail.com"
            className="bg-emerald-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition-all duration-300 josefin-sans"
          >
            Get in Touch {"-->"}
          </motion.a>
        </section>
      </main>

      <footer className="bg-[#1e1e1e] text-center p-4 text-gray-500 josefin-sans">
        <p>&copy; {today.toDateString()} Ayush Gairola. All rights reserved.</p>
      </footer>

      {/* Floating Chatbot UI */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: '50%', y: '50%' }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-10 right-4 md:right-15 w-[90vw] max-w-md h-[70vh] bg-[#1e1e1e] rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-cyan-400"
          >
            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white ">Ask about Ayush!</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div ref={chatMessagesRef} className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} josefin-sans`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-gray-700 text-gray-100 rounded-bl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-xl rounded-bl-none px-4 py-2 text-gray-100 animate-pulse">
                    ...
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 bg-[#1a1a1a] border-t border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-gray-800 text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-600 josefin-sans"
                  placeholder="Ask about Ayush..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-cyan-600 text-white rounded-full p-2 hover:bg-cyan-500 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-cyan-600 text-white p-2 rounded-full shadow-lg hover:bg-cyan-500 transition-colors duration-200 z-50 cursor-pointer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-2xl">✨</span>
      </motion.button>
    </div>
  );
};

export default App;
