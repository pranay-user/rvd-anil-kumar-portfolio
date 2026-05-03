/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Mail, 
  Linkedin, 
  Youtube, 
  Phone, 
  MapPin, 
  Send, 
  ExternalLink, 
  ChevronRight,
  Code,
  Box,
  Layers,
  Zap
} from "lucide-react";
import React, { useState } from "react";
import { db } from "./lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import profilePic from "./assets/profile.jpg";
import bahabahubali from "./assets/projects/balabahubali.jpeg";
import dinostur from "./assets/projects/Dinostar.jpeg";
import dinorock from "./assets/projects/Dinorock.jpeg";
import gattu_battu from "./assets/projects/gattubattu.jpeg";
import ladybug from "./assets/projects/MLB.jpeg";
import rudra from "./assets/projects/Rudra.jpeg";
import super_speedo from "./assets/projects/kikosuperspeedo.jpeg";
import titus from "./assets/projects/titus.jpeg";
import benjaman from "./assets/projects/Benjiman.jpeg";
import big_nate from "./assets/projects/Bignate.jpeg";
import bga from "./assets/projects/Beargrylls.jpeg";
import dinda_novi from "./assets/projects/dindanovi.jpeg";
import pirata_capitano from "./assets/projects/pirate.jpeg";
import power_players from "./assets/projects/powerplayers.jpeg";
import byjus from "./assets/projects/Byjus.jpeg";
import denver from "./assets/projects/denver.jpeg";
import robin_hood from "./assets/projects/Robinhood.jpeg";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {}, // We don't have auth for visitors yet
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}



const PROJECTS = [
  { name: "Kiko Super Speedo", image: super_speedo },
  { name: "Denver", image: denver },
  { name: "Lady Bug", image: ladybug },
  { name: "Power Players", image: power_players },
  { name: "Byju’s", image: byjus },
  { name: "Titus", image: titus },
  { name: "Robin Hood", image: robin_hood },
  { name: "Bala Bahubali", image: bahabahubali },
  { name: "Dinda and Novi", image: dinda_novi },
  { name: "Gattu Battu", image: gattu_battu },
  { name: "Dinostur", image: dinostur },
  { name: "DinoRock", image: dinorock },
  { name: "Rudra", image: rudra },
  { name: "Pirata & Capitano", image: pirata_capitano },
  { name: "Benjaman", image: benjaman },
  { name: "Big nate", image: big_nate },
  { name: "BGA (Bear Grylls)", image: bga },
];



const SKILLS = [
  { name: "Houdini", level: 95, icon: <Box className="w-5 h-5" /> },
  { name: "Maya", level: 90, icon: <Box className="w-5 h-5" /> },
  { name: "Nuke", level: 90, icon: <Layers className="w-5 h-5" /> },
  { name: "Fume", level: 80, icon: <Zap className="w-5 h-5" /> },
  { name: "Realflow", level: 80, icon: <Zap className="w-5 h-5" /> },
  { name: "Unreal", level: 90, icon: <Code className="w-5 h-5" /> },
];

const EXPERIENCE = [
  { company: "Warnick Studios", role: "FX Artist", loc: "Hyderabad", period: "Jan 2025 - Present" },
  { company: "Xentrix Studios", role: "FX Artist", loc: "Bengaluru", period: "Nov 2022 - Jan 2025" },
  { company: "Philm CGI Studios", role: "FX Artist", loc: "Pune", period: "Feb 2022 - Nov 2022" },
  { company: "Symbiosys Technologies", role: "FX Artist", loc: "Visakhapatnam", period: "Apr 2019 - Feb 2022" },
  { company: "Yuva Animation Studios", role: "Junior FX Artist", loc: "Rajahmundry", period: "Apr 2018 - Apr 2019" },
];

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-display font-bold text-white mb-2"
    >
      <span className="text-primary mr-2">//</span>
      {title}
    </motion.h2>
    {subtitle && <p className="text-gray-400 text-lg ml-8">{subtitle}</p>}
  </div>
);

export default function App() {
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    
    try {
      const path = 'messages';
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      // EmailJS Notification
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'anilnandhu0@gmail.com',
          },
          publicKey
        );
      }

      setFormStatus("sent");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setFormStatus("error");
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-surface">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="font-display font-bold text-xl tracking-tighter text-white">
            PORT<span className="text-primary italic">FOLIO</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
            <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
            <a href="#youtube" className="hover:text-primary transition-colors">Show Reel</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <a href="#contact" className="bg-primary/10 border border-primary/20 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-surface transition-all">
            Hire Me
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] text-primary uppercase font-bold tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Available for freelance
          </div>
          <h1 className="text-7xl md:text-8xl font-display font-bold leading-none text-white mb-6">
            RVD <br />
            <span className="text-primary">ANIL</span> KUMAR
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
            FX ARTIST specializing in complex simulations and visual effects. 
            Transforming concepts into high-fidelity artistic realities.
          </p>
          <div className="flex gap-4">
            <a href="#projects" className="bg-white text-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary transition-all rounded-sm flex items-center gap-2 group">
              View Work <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center gap-4 ml-4">
              <a href="https://linkedin.com/in/anil-kumar-veera-durga-b7a236190" target="_blank" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="https://www.youtube.com/user/9985526716/videos" target="_blank" className="text-gray-400 hover:text-white transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-700" />
          <div className="relative aspect-[4/5] bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm p-4">
             <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden group">
                <img 
                  src={profilePic} 
                  alt="RVD Anil Kumar" 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8">
                   <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Based in</p>
                   <p className="text-lg font-display text-white">Hyderabad, India</p>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <SectionHeader title="Expertise" subtitle="Artistic mediums & technical mastery" />
        <div className="grid md:grid-cols-2 gap-16">
          <div className="text-gray-400 space-y-6 text-lg leading-relaxed">
            <p>
              Dedicated Visual Artist with a decorated background in a variety of artistic mediums. 
              Highly experienced in illustration and animation. Adept at working independently 
              and collaboratively on projects, and committed to achieving visual innovation and beauty.
            </p>
            <p>
              With over 7 years of experience in the animation industry, I have contributed to major 
              projects for global audiences, from Nickelodeon hits to independent cinematic experiences.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div>
                <p className="text-3xl font-display font-bold text-white">07+</p>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">Years Experience</p>
             </div>
             <div>
                <p className="text-3xl font-display font-bold text-white">20+</p>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">Major Projects</p>
             </div>
             <div>
                <p className="text-3xl font-display font-bold text-white">05+</p>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">Studios</p>
             </div>
             <div>
                <p className="text-3xl font-display font-bold text-white">100%</p>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">Commitment</p>
             </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
        <SectionHeader title="Skillset" subtitle="Technical arsenal for FX production" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{skill.name}</h3>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <SectionHeader title="Journey" subtitle="Professional path through world-class studios" />
        <div className="space-y-4">
          {EXPERIENCE.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-primary"
            >
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">{exp.period}</p>
                <h3 className="text-2xl font-bold text-white">{exp.company}</h3>
                <p className="text-gray-400 capitalize">{exp.role} — {exp.loc}</p>
              </div>
              <div className="mt-4 md:mt-0 text-white/20 group-hover:text-primary transition-colors">
                <ChevronRight size={32} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
            <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
        <SectionHeader title="Project Registry" subtitle="Notable contributions in film and television" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all cursor-pointer"
            >
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity">VFX Production</p>
                <h3 className="text-lg font-bold text-white leading-tight">{project.name}</h3>
              </div>
              <div className="absolute top-4 right-4 p-2 bg-surface/80 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* YouTube Section */}
      <section id="youtube" className="py-20 px-6 max-w-7xl mx-auto bg-primary/5 rounded-[3rem] border border-primary/10">
        <SectionHeader title="Motion Reel" subtitle="Witness the simulations in action" />
        <div className="grid lg:grid-cols-2 gap-8 items-center">
           <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl shadow-primary/20">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed?listType=user_uploads&list=9985526716" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              />
           </div>
           <div className="lg:pl-12">
              <h3 className="text-3xl font-display font-bold text-white mb-6">Technical Showreel</h3>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Featured work including particle simulations, liquid dynamics, and cinematic lighting setups. 
                Full breakdown of work across various studios available on the channel.
              </p>
              <a 
                href="https://www.youtube.com/user/9985526716/videos" 
                target="_blank"
                className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest hover:translate-x-2 transition-transform"
              >
                Watch More <Youtube />
              </a>
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 max-w-7xl mx-auto">
        <SectionHeader title="Get In Touch" subtitle="Let's build something cinematic together" />
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="space-y-8 mb-12">
              <div className="flex gap-6 items-start">
                 <div className="p-4 bg-white/5 rounded-2xl text-primary"><Mail /></div>
                 <div>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Email</p>
                    <p className="text-xl text-white">anilnandhu0@gmail.com</p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <div className="p-4 bg-white/5 rounded-2xl text-primary"><Phone /></div>
                 <div>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Phone</p>
                    <p className="text-xl text-white">+91 9985887637</p>
                 </div>
              </div>
              <div className="flex gap-6 items-start">
                 <div className="p-4 bg-white/5 rounded-2xl text-primary"><MapPin /></div>
                 <div>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Location</p>
                    <p className="text-xl text-white">Hyderabad, India</p>
                 </div>
              </div>
            </div>
            
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-gray-300 mb-6 font-medium">Looking for a Senior FX Artist to join your next major production?</p>
              <div className="flex gap-4">
                 <a href="https://linkedin.com/in/anil-kumar-veera-durga-b7a236190" target="_blank" className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg text-white transition-colors">
                    <Linkedin />
                 </a>
                 <a href="https://www.youtube.com/user/9985526716/videos" target="_blank" className="p-3 bg-white/5 hover:bg-primary/20 rounded-lg text-white transition-colors">
                    <Youtube />
                 </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" 
                    placeholder="John Wick" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" 
                    placeholder="john@continental.com" 
                  />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Subject</label>
               <input 
                required 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" 
                placeholder="New Production Inquiry" 
               />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
               <textarea 
                required 
                rows={5} 
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white resize-none" 
                placeholder="How can I help you?" 
               />
            </div>
            <button 
              disabled={formStatus === "sending"}
              className={`w-full py-5 rounded-xl font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                formStatus === "sent" ? "bg-green-500/20 text-green-500 border border-green-500/50" : 
                formStatus === "error" ? "bg-red-500/20 text-red-500 border border-red-500/50" :
                "bg-primary text-surface hover:brightness-110 active:scale-[0.98]"
              }`}
            >
              {formStatus === "idle" && <><Send size={18} /> Send Signal</>}
              {formStatus === "sending" && "Syncing Transmission..."}
              {formStatus === "sent" && "Transmission Received"}
              {formStatus === "error" && "Link Failure - Retry?"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="font-display font-bold text-white text-lg">
               RVD <span className="text-primary italic">ANIL KUMAR</span>
            </div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">
               © {new Date().getFullYear()} — Developed By RVD Anil Kumar. All rights reserved.
            </p>
            <div className="flex gap-6">
               <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Privacy</a>
               <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
