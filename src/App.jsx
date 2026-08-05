import { useState, useEffect } from 'react'
import machines from './data/machines.json'
import './App.css'

// Business Configuration Constants
const WHATSAPP_NUMBER = "8613710117282" // China WhatsApp contact
const CONTACT_EMAIL = "Info@cwc-cn.com"
const BUSINESS_ADDRESS = "ROOM B281, 2nd Floor, Hualiyuan NO.226, Hedong Road, Liwan District, Guangzhou, Guangdong, China"
const CONTACT_PHONE = "China HQ: +86 20 8888 8888"
const BUSINESS_HOURS = "Mon - Fri: 08:30 - 17:30 (CST / UTC+8)"

function App() {
  const [selectedMachineId, setSelectedMachineId] = useState(null)

  // State for category filtering
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Extract unique categories
  const categories = ["All", ...new Set(machines.map(m => m.category).filter(Boolean))]

  // Filter machines based on selected category
  const filteredMachines = selectedCategory === "All" 
    ? machines 
    : machines.filter(m => m.category === selectedCategory)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Enquiry Form State
  const [formName, setFormName] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formMachine, setFormMachine] = useState("")
  const [formMessage, setFormMessage] = useState("")

  // Set page scroll listener for navbar shading
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveImageIndex(0)
  }, [selectedMachineId])

  // Get current active machine
  const currentMachine = machines.find(m => m.id === selectedMachineId)

  // Generate detailed WhatsApp Message for a specific machine
  const getWhatsAppProductLink = (machineOrName) => {
    let machineObj = typeof machineOrName === 'object' ? machineOrName : machines.find(m => m.name === machineOrName || m.model === machineOrName);
    
    if (machineObj) {
      const paperSize = machineObj.specs?.paperSize || 'Standard';
      const maxSpeed = machineObj.specs?.maxSpeed || 'High Speed';
      const category = machineObj.category || 'Cutter Series';
      
      const text = `*Machinery Quote Enquiry - XCT CHINA*\n\n` +
                   `*Model:* ${machineObj.name}\n` +
                   `*Category:* ${category}\n` +
                   `*Max Speed:* ${maxSpeed}\n` +
                   `*Media Size:* ${paperSize}\n\n` +
                   `Hello XCT China team, I would like to receive an official price quotation, FOB shipping details, and catalogue for the ${machineObj.name}.`;
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    const text = `Hello XCT China team, I am interested in ${machineOrName}. Please send the official price quotation and brochure details.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  // Handle Form Submission via WhatsApp
  const handleWhatsAppEnquiry = (e) => {
    e.preventDefault()
    if (!formName || !formPhone || !formMachine) {
      alert("Please fill in Name, Phone, and select a Machine.")
      return
    }

    const text = `*New Machinery Enquiry*\n\n` +
                 `*Name:* ${formName}\n` +
                 `*Company:* ${formCompany || 'N/A'}\n` +
                 `*Phone:* ${formPhone}\n` +
                 `*Email:* ${formEmail || 'N/A'}\n` +
                 `*Machine:* ${formMachine}\n\n` +
                 `*Message:*\n${formMessage || 'Hello, I would like to request more details and a price quote for this machine.'}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
  }

  // Handle Form Submission via Email
  const handleEmailEnquiry = () => {
    if (!formName || !formPhone || !formMachine) {
      alert("Please fill in Name, Phone, and select a Machine.")
      return
    }

    const subject = `Machinery Inquiry: ${formMachine}`;
    const body = `New Enquiry Details:\n\n` +
                 `Name: ${formName}\n` +
                 `Company: ${formCompany || 'N/A'}\n` +
                 `Phone: ${formPhone}\n` +
                 `Email: ${formEmail || 'N/A'}\n` +
                 `Machine: ${formMachine}\n\n` +
                 `Message:\n${formMessage || 'Hello, please send us a quote and brochures.'}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Trigger form selection when clicking enquiry from details
  const triggerEnquiryWithMachine = (machineName) => {
    setFormMachine(machineName)
    setSelectedMachineId(null) // Return to home
    setTimeout(() => {
      const element = document.getElementById("enquiry")
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  // Dynamic brochure download simulation
  const handleBrochureDownload = (e, machineName) => {
    e.preventDefault();
    alert(`Thank you for your interest! The brochure for "${machineName}" is ready. We will send the PDF brochure and catalogues to your WhatsApp or Email as soon as you submit your enquiry form below.`);
    const element = document.getElementById("enquiry");
    if (element) {
      setFormMachine(machineName);
      setFormMessage(`Hello, I would like to download the brochure for ${machineName}. Please send the catalog PDF to my email/phone.`);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Industry Section details
  const industries = [
    { name: "Printing", icon: "fa-solid fa-print" },
    { name: "Packaging", icon: "fa-solid fa-box" },
    { name: "Carton Manufacturing", icon: "fa-solid fa-boxes-packing" },
    { name: "Label Production", icon: "fa-solid fa-tags" },
    { name: "Commercial Printing", icon: "fa-solid fa-newspaper" },
    { name: "Paper Products", icon: "fa-solid fa-file-invoice" }
  ];

  // Why Choose Us details (Punchy & Concise)
  const strengths = [
    { title: "Micron Precision", desc: "Advanced optical sensors ensure ±0.05mm register accuracy.", icon: "fa-solid fa-bullseye" },
    { title: "Heavy Cast-Iron Build", desc: "Vibration-free alloy frame designed for continuous 24/7 operation.", icon: "fa-solid fa-shield-halved" },
    { title: "Direct Factory Support", desc: "Expert technicians on call to ensure maximum uptime.", icon: "fa-solid fa-user-gear" },
    { title: "Fast Global Delivery", desc: "In-stock models ready for fast worldwide shipment.", icon: "fa-solid fa-truck-fast" },
    { title: "Genuine Spare Parts", desc: "Full inventory of chases, platens, and bars ready to ship.", icon: "fa-solid fa-gears" },
    { title: "Turnkey Installation", desc: "On-site setup, leveling, and team training by certified engineers.", icon: "fa-solid fa-screwdriver-wrench" }
  ];

  // Demonstration Videos (Direct HTML5 Autoplay Local Videos)
  const demoVideos = [
    {
      title: "Automatic Die Cutting Run",
      desc: "High-speed carton board die cutting & creasing operation.",
      videoSrc: "/videos/VIDEO-1.mp4",
      tag: "Video Demonstration 1"
    },
    {
      title: "Precision Material Feeding",
      desc: "Continuous automated sheet feeding and alignment.",
      videoSrc: "/videos/VIDEO-2.mp4",
      tag: "Video Demonstration 2"
    },
    {
      title: "Hot Foil Stamping & Embossing",
      desc: "Dual-axis precision foil stamping & embossing run.",
      videoSrc: "/videos/VIDEO-3.mp4",
      tag: "Video Demonstration 3"
    },
    {
      title: "High-Speed Stripping Station",
      desc: "Automated waste stripping and stacking mechanism.",
      videoSrc: "/videos/VIDEO-4.mp4",
      tag: "Video Demonstration 4"
    },
    {
      title: "Heavy-Duty Platen Press Operation",
      desc: "Heavy greyboard & corrugated sheet die cutting.",
      videoSrc: "/videos/VIDEO-5.mp4",
      tag: "Video Demonstration 5"
    }
  ];

  return (
    <div>
      {/* Navigation Header */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo-container" onClick={() => setSelectedMachineId(null)}>
            <i className="fa-solid fa-compass-drafting logo-icon"></i>
            <div>
              <span className="logo-text">XCT CHINA</span>
              <span className="logo-subtext">Industrial Machinery Supply</span>
            </div>
          </div>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#hero" className="nav-link" onClick={(e) => {
              e.preventDefault();
              setSelectedMachineId(null);
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>Home</a>
            <a href="#machines" className="nav-link" onClick={(e) => {
              e.preventDefault();
              setSelectedMachineId(null);
              setMobileMenuOpen(false);
              setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}>Machines</a>
            <a href="#why-us" className="nav-link" onClick={(e) => {
              e.preventDefault();
              setSelectedMachineId(null);
              setMobileMenuOpen(false);
              setTimeout(() => document.getElementById("why-us")?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}>Why Choose Us</a>
            <a href="#videos" className="nav-link" onClick={(e) => {
              e.preventDefault();
              setSelectedMachineId(null);
              setMobileMenuOpen(false);
              setTimeout(() => document.getElementById("videos")?.scrollIntoView({ behavior: 'smooth' }), 100);
            }}>Demonstrations</a>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello XCT China team, I am interested in your industrial die cutting and plotting machinery. Please send an official product catalog and price list.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link nav-cta" 
              onClick={() => setMobileMenuOpen(false)}
            >
              Get a Quote
            </a>
          </nav>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {selectedMachineId && currentMachine ? (
        /* ==================== PRODUCT DETAILS VIEW ==================== */
        <>
          <section className="product-details-view">
            <div className="container">
              {/* Back Button */}
              <div className="back-btn" onClick={() => setSelectedMachineId(null)}>
                <i className="fa-solid fa-arrow-left"></i> Back to All Machines
              </div>

              <div className="details-layout">
                {/* Single Page Specification Sheet Display */}
                <div className="details-gallery">
                  <div className="details-main-image spec-sheet-view">
                    <div className="spec-header-tag">
                      <i className="fa-solid fa-file-invoice"></i> Machine Specification Sheet
                    </div>
                    <img src={currentMachine.image} alt={`${currentMachine.name} Specification Sheet`} />
                  </div>
                  <div className="spec-sheet-note">
                    <i className="fa-solid fa-circle-info"></i> Direct factory specification sheet for {currentMachine.name}
                  </div>
                </div>

                {/* Technical Information Column */}
                <div className="details-info">
                  <span className="section-tag">Model Specifications</span>
                  <h1 style={{ fontSize: '38px', margin: '8px 0 16px 0', letterSpacing: '-0.02em' }}>{currentMachine.name}</h1>
                  <p className="details-tagline">{currentMachine.tagline}</p>
                  <p className="details-desc">{currentMachine.description}</p>

                  <div className="details-cta-block">
                    <a href={getWhatsAppProductLink(currentMachine.name)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-full">
                      <i className="fa-brands fa-whatsapp"></i> Instant Quote on WhatsApp
                    </a>
                    <p>Immediate response during business hours</p>
                  </div>

                  <h3 className="details-section-title">Key Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(currentMachine.technicalSpecs || {}).map(([label, value]) => (
                        <tr key={label}>
                          <td className="label-td">{label}</td>
                          <td className="val-td">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3 className="details-section-title">Performance & Construction Features</h3>
                  <ul className="features-list">
                    {(currentMachine.features || []).map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>

                  <h3 className="details-section-title">Primary Applications</h3>
                  <div className="apps-tags">
                    {(currentMachine.applications || []).map((app, idx) => (
                      <span key={idx} className="app-tag">{app}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Machines Section */}
              <div style={{ marginTop: '80px', borderTop: '1px solid var(--border-color)', paddingTop: '64px' }}>
                <h3 className="section-title" style={{ fontSize: '28px', marginBottom: '32px' }}>Related Machines</h3>
                <div className="products-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {machines
                    .filter(m => m.id !== selectedMachineId)
                    .slice(0, 3)
                    .map((machine) => (
                      <div key={machine.id} className="product-card" onClick={() => setSelectedMachineId(machine.id)}>
                        <div className="product-image-container" style={{ paddingTop: '60%' }}>
                          <img src={machine.image} alt={machine.name} loading="lazy" />
                        </div>
                        <div className="product-content" style={{ padding: '20px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{machine.name}</h4>
                          <p className="product-card-desc" style={{ fontSize: '13px', marginBottom: '16px', WebkitLineClamp: 2 }}>{machine.tagline}</p>
                          <button className="btn btn-secondary btn-full btn-sm" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setSelectedMachineId(machine.id)}>
                            View Product Specs
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Bottom WhatsApp / Enquiry Bar */}
          <div className="sticky-cta-bar">
            <div className="sticky-info">
              <span className="sticky-name">{currentMachine.name}</span>
              <span className="sticky-tagline">Request quote for immediate packaging production.</span>
            </div>
            <div className="sticky-actions">
              <a href={getWhatsAppProductLink(currentMachine.name)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="fa-brands fa-whatsapp"></i> WhatsApp Enquiry
              </a>
            </div>
          </div>
        </>
      ) : (
        /* ==================== LANDING PAGE VIEW ==================== */
        <>
          {/* Hero Section */}
          <section id="hero" className="hero-section">
            <div className="container">
              <div className="hero-grid">
                <div className="hero-content">
                  <div className="hero-badge">
                    <i className="fa-solid fa-award"></i>
                    <span>Direct Factory Supplier</span>
                  </div>
                  <h1 className="hero-headline">
                    High-Precision Die Cutting & Creasing Machines
                  </h1>
                  <p className="hero-description">
                    Industrial die cutting, creasing, and foil stamping solutions built for maximum speed, accuracy, and heavy 24/7 production.
                  </p>
                  <div className="hero-actions">
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I am interested in your die cutting machines. Please send a catalog and price quote.")}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      <i className="fa-brands fa-whatsapp"></i> Get Quote on WhatsApp
                    </a>
                    <a href="#machines" className="btn btn-secondary" onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      View Models
                    </a>
                  </div>
                  <div className="hero-metrics">
                    <div className="metric-item">
                      <span className="metric-val">±0.05mm</span>
                      <span className="metric-lbl">Register Accuracy</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">300 Tons</span>
                      <span className="metric-lbl">Max Pressure</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-val">24/7</span>
                      <span className="metric-lbl">Factory Support</span>
                    </div>
                  </div>
                </div>
                <div className="hero-media">
                  <div className="hero-image-wrapper">
                    <img src="/images/hero_machine.png" alt="Industrial Die Cutting Machine" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Machine Demonstration Section (Direct HTML5 Autoplay Video Showcase) */}
          <section id="videos">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Live Factory Demonstration</span>
                <h2 className="section-title">See Machine Performance Live</h2>
                <p className="section-desc">
                  Direct live operational footage showcasing high-speed feeding accuracy, structural stability, and stripping precision.
                </p>
              </div>

              <div className="video-showcase-grid">
                {demoVideos.map((video, idx) => (
                  <div key={idx} className="video-showcase-card">
                    <div className="video-player-container">
                      <video
                        src={video.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                      ></video>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Product Listing Section */}
          <section id="machines" className="section-bg">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Product Catalog</span>
                <h2 className="section-title">Industrial Machinery Lineup</h2>
                <p className="section-desc">
                  Select a model to view full technical specifications or request an instant factory quotation.
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="category-filter-bar">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat} {cat === 'All' ? `(${machines.length})` : ''}
                  </button>
                ))}
              </div>

              <div className="products-grid">
                {filteredMachines.map((machine) => (
                  <div key={machine.id} className="product-card" onClick={() => setSelectedMachineId(machine.id)}>
                    <div className="product-image-container">
                      <div className="brochure-badge">
                        <i className="fa-solid fa-file-pdf"></i> Spec Sheet
                      </div>
                      <img src={machine.image} alt={machine.name} loading="lazy" />
                    </div>
                    <div className="product-content">
                      <h3 className="product-card-title">{machine.name}</h3>
                      <p className="product-card-tagline">{machine.tagline}</p>

                      <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-secondary btn-sm" style={{ flex: '1 1 40%' }} onClick={() => setSelectedMachineId(machine.id)}>
                          View Specs
                        </button>
                        <a href={getWhatsAppProductLink(machine.name)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" style={{ flex: '1 1 60%' }}>
                          <i className="fa-brands fa-whatsapp"></i> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section id="why-us" className="section-bg">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Why Choose Us</span>
                <h2 className="section-title">Built to Last. Backed by Experts.</h2>
                <p className="section-desc">
                  Proven reliability, precision engineering, and full after-sales support for packaging manufacturers worldwide.
                </p>
              </div>

              <div className="why-grid">
                {strengths.map((item, idx) => (
                  <div key={idx} className="why-card">
                    <div className="why-icon">
                      <i className={item.icon}></i>
                    </div>
                    <h3 className="why-title">{item.title}</h3>
                    <p className="why-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Industries We Serve Section */}
          <section id="industries">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Applications</span>
                <h2 className="section-title">Industries We Serve</h2>
                <p className="section-desc">
                  Tailored machinery for high-volume commercial printing and packaging production lines.
                </p>
              </div>

              <div className="industries-grid">
                {industries.map((ind, idx) => (
                  <div key={idx} className="industry-card">
                    <div className="industry-icon">
                      <i className={ind.icon}></i>
                    </div>
                    <h4 className="industry-name">{ind.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Details & Google Map Section */}
          <section id="contact">
            <div className="container">
              <div className="section-header">
                <span className="section-tag">Global Headquarters</span>
                <h2 className="section-title">Get in Touch</h2>
                <p className="section-desc">
                  Visit our regional showcase facility or call our support lines directly.
                </p>
              </div>

              <div className="contact-grid">
                <div className="contact-info-panel">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="contact-details">
                      <h4>Factory Address</h4>
                      <p>{BUSINESS_ADDRESS}</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div className="contact-details">
                      <h4>Phone Number</h4>
                      <p>{CONTACT_PHONE}</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-brands fa-whatsapp"></i>
                    </div>
                    <div className="contact-details">
                      <h4>WhatsApp Support</h4>
                      <p>+{WHATSAPP_NUMBER} (Enquiries & Logistics)</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="contact-details">
                      <h4>Email Address</h4>
                      <p>{CONTACT_EMAIL}</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fa-solid fa-clock"></i>
                    </div>
                    <div className="contact-details">
                      <h4>Business Hours</h4>
                      <p>{BUSINESS_HOURS}</p>
                    </div>
                  </div>
                </div>

                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.5404222415566!2d-0.12981568423023027!3d51.5032972796347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c7ec5b4aab%3A0xe7f9a2e3ffc129e9!2sLondon%20Eye!5e0!3m2!1sen!2suk!4v1689234231920!5m2!1sen!2suk"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="XCT China Showroom Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <i className="fa-solid fa-compass-drafting footer-logo-icon"></i>
                <div>
                  <span className="footer-logo-text">XCT CHINA</span>
                  <span className="footer-logo-subtext">Industrial Machinery Supply</span>
                </div>
              </div>
              <p className="footer-desc">
                High-end industrial die cutting and creasing equipment for printing, corrugated carton, and luxury packaging. We supply high-precision solutions that elevate production quality.
              </p>
              <div className="footer-socials">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-title">Product Series</h4>
              <ul className="footer-links">
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("Sheet-Fed Auto-Feeding Cutter Series");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Sheet-Fed Auto-Feeding Cutters</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("Heavy-Duty Vacuum / Suction Feed Cutters");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Heavy-Duty Suction Feed Cutters</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("Roll-to-Roll Continuous Cutting Machines");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Roll-to-Roll Continuous Cutters</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("Desktop & Compact Entry Cutters");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Desktop & Compact Cutters</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("Wide Format Vinyl Cutters & Plotters");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Wide Format Plotters</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory("XCTCUT Industrial Flatbed Cutters");
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Industrial Flatbed Cutters</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#hero" onClick={(e) => {
                    e.preventDefault();
                    setSelectedMachineId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}>Home</a>
                </li>
                <li>
                  <a href="#machines" onClick={(e) => {
                    e.preventDefault();
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("machines")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Machinery Lineup</a>
                </li>
                <li>
                  <a href="#why-us" onClick={(e) => {
                    e.preventDefault();
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("why-us")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Why Choose Us</a>
                </li>
                <li>
                  <a href="#videos" onClick={(e) => {
                    e.preventDefault();
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("videos")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Demonstration Videos</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => {
                    e.preventDefault();
                    setSelectedMachineId(null);
                    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}>Contact Us</a>
                </li>
              </ul>
            </div>

            <div className="footer-contact">
              <h4 className="footer-title">Contact Office</h4>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot"></i>
                <span>{BUSINESS_ADDRESS}</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-phone"></i>
                <span>{CONTACT_PHONE}</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-envelope"></i>
                <span>{CONTACT_EMAIL}</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} XCT China. All Rights Reserved. Private B2B Manufacturing Supply.</p>
            <div className="footer-bottom-links">
              <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
              <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
