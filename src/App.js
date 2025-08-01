import './App.css';
import { useState, useEffect, useRef } from 'react'
import i18next from 'i18next'

import { Icon } from '@iconify/react'

import { resources } from './resources.js'
import { oneTimeWordFromSecond } from './tools.js'

function height() {
  return window.visualViewport?.height || window.innerHeight 
}

function Glow(props) {
  return <span className="glow-text">{props.content}</span>
}

function clamp(num, lower, upper) {
  return Math.min(Math.max(num, lower), upper)
}

function pageUp(x, unit, min, max) {
  const floored = Math.floor(x / unit)
  return clamp((x / unit) - floored < 0.25 ? (floored - 1) : floored, min, max) * unit
}

function pageDown(x, unit, min, max) {
  const ceiled = Math.ceil(x / unit)
  return clamp(ceiled - (x / unit) < 0.25 ? (ceiled + 1) : ceiled, min, max) * unit
}

function insertGlow(text, glowWords) {
  const parts = text.split('_')
  const output = []

  for (let i = 0; i < parts.length; i++) {
    output.push(parts[i])
    if (i < glowWords.length) {
      output.push(<Glow key={i} content={glowWords[i]} />)
    }
  }

  return <>{output}</>
}

function App() {
  const [language, setLanguage] = useState("en")
  const [startTime, setStartTime] = useState(null);
  const [timePassed, setTimePassed] = useState(0);
  const [scrolled, setScrolled] = useState(Math.round(window.scrollY / height()))
  const [domainStartTime, setDomainStartTime] = useState(Date.now());
  const [subdomains, setSubdomains] = useState([null, null])
  const [lastY, setLastY] = useState(null)
  const [mover, setMover] = useState(null)

  const languages = ["en", "tp"] 
  const isAnimating = useRef(false)
 
  i18next.init({
    lng: language,
    resources: resources,
    returnObjects: true
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const pages = i18next.t("tabs")

  const scrollByPage = (direction) => {
    const prevScrolled = Math.round(window.scrollY / height())
    const change = direction === "down" ? 1 : -1
    const index = prevScrolled + change - 2
    setSubdomains(prevSubdomains => {
      let next = null
      if (index >= 0 && index <= i18next.t("subdomains").length - 1) {
        next = i18next.t("subdomains")[clamp(index, 0, i18next.t("subdomains").length - 1)].domain
      }
      if (prevSubdomains[1] !== next) {
        return [prevSubdomains[1], next]
      }
      return prevSubdomains
    })
    setDomainStartTime(Date.now())

    const pageHeight = height() // or window.innerHeight
    const currentPos = window.scrollY
    const targetPos = direction === 'down' 
      ? pageDown(currentPos, pageHeight, 0, i18next.t("subdomains").length + 2) 
      : pageUp(currentPos, pageHeight, 0, i18next.t("subdomains").length + 2)

    window.scrollTo({ top: targetPos, behavior: 'smooth' })

    // estimate scroll end after 500ms or use scroll event listeners for better control
    setTimeout(() => {
      isAnimating.current = false
    }, 600)
  }

  useEffect(() => { 
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        scrollByPage("down")
      } else if (e.key === 'ArrowUp') {
        scrollByPage("up")
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const intervalId = setInterval(() => {
      setTimePassed(Date.now() - startTime);
      setScrolled(Math.round(window.scrollY / height()))
      setSubdomains(prevSubdomains => {
        const index = Math.round(window.scrollY / height()) - 2
        let next = null
        if (index >= 0 && index <= i18next.t("subdomains").length - 1) {
          next = i18next.t("subdomains")[clamp(index, 0, i18next.t("subdomains").length - 1)].domain
        }
        if (prevSubdomains[1] !== next) {
          return [prevSubdomains[1], next]
        }
        return prevSubdomains
      })
    }, 16) // roughly 60fps update

    return () => clearInterval(intervalId);
  }, [startTime]);

  useEffect(() => {
    const onWheel = (e) => {
      if (mover && mover !== "wheel") {
        return
      } else {
        setMover("wheel")
      }
      e.preventDefault()
      if (e.deltaY > 0) {
        scrollByPage('down')
      } else if (e.deltaY < 0) {
        scrollByPage('up')
      }
      setMover(null)
    }

    function onTouchMove(e) {
      if (mover && mover !== "touchmove") {
        return
      } else {
        setMover("touchmove")
      }
      const currentY = e.touches[0].clientY;
      if (lastY !== null) {
        const deltaY = currentY - lastY;
        if (deltaY > 0) {
          scrollByPage('down')
        } else if (deltaY < 0) {
          scrollByPage('up')
        }
      }
      setMover(null)
      setLastY(currentY)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      document.body.style.overflow = '' // reset on unmount
    }
  }, [lastY, mover])

  return (
    <div className="main">
      <div className="navbar">
        <div className="pages">
          {pages.map((i, ind) => (
            <div
              key={i}
              className={Math.round(window.scrollY / height()) === ind ? "glow-text" : ""}
              onClick={() => window.scrollTo({ top: height() * ind, behavior: 'smooth' })}
            >{i}</div>
          ))}
        </div>
        <div className="settings">
          {i18next.t("sitelangs").map((i, ind) => (
            <div 
              key={i}
              className={ind === languages.indexOf(language) ? "glow-text" : ""} 
              onClick={() => setLanguage(languages[ind])}
            >{i}</div>
          ))}
        </div>
        <div className="language" onClick={() => {setLanguage(prev => languages[(languages.indexOf(prev) + 1) % languages.length])}}>
          {i18next.t("sitelangs")[languages.indexOf(language)]}
        </div>
      </div>
      <div className="page">
        <div className="header">{i18next.t("greeting")[0]}<Glow content={i18next.t("name")(timePassed)} />{i18next.t("greeting")[1]}</div>
      </div>
      <div className="page">
        <div className="about-header">{i18next.t("aboutme")}</div>
        <div className={`about-me ${i18next.language}`}>
          <p>{i18next.t("greeting")[0]}<Glow content={i18next.t("name")(timePassed)} />{i18next.t("greeting")[1]}</p>
          {i18next.t("about").map(i => <p>{insertGlow(...i)}</p>)}
        </div>
      </div>
      <div className="scroll" style={{height: (100 * i18next.t("subdomains").length) + "vh"}}>
        <div className="sticky subdomain">
          <div className="header url" onClick={() => window.open("https://" + i18next.t("subdomains")[clamp(scrolled - 2, 0, i18next.t("subdomains").length - 1)].domain + ".tbdhk.xyz")}>
            <Glow content={`${oneTimeWordFromSecond(subdomains, Date.now() - domainStartTime, 500)}.tbdhk.xyz`} />
          </div>
          <div>{i18next.t("subdomains")[clamp(scrolled - 2, 0, i18next.t("subdomains").length - 1)].description}</div>
        </div>
      </div>
      <div 
        className="button"
        id="page-up"
        onClick={() => scrollByPage("up")}
      >
      {scrolled ? <Icon icon="oui:arrow-up" /> : null}
      </div>
      <div 
        className="button"
        id="page-down"
        onClick={() => scrollByPage("down")}
      >
      {scrolled < 2 + i18next.t("subdomains").length ? <Icon icon="oui:arrow-down" /> : null}
      </div>
      <div className="page">
        <div className="about-header">{i18next.t("talk")}<Glow content={i18next.t("language")(timePassed)}/>:</div>
        <div className="icon-tray">
          <Icon icon="fa6-brands:github" onClick={() => window.open("https://github.com/tb-dhk")} />
          <Icon icon="fa6-brands:discord" onClick={() => window.open("https://discord.com/users/876607304236163102")} />
          <Icon icon="fa6-brands:instagram" onClick={() => window.open("https://www.instagram.com/tbdhk_/")} />
          <Icon icon="simple-icons:pronounsdotpage" onClick={() => window.open("https://en.pronouns.page/@tbdhk")} />
        </div>
        <div id="sike-pona">
          <link rel="stylesheet" href="https://sike.pona.la/embed.css"/>
          <span id="left">
            <a href="https://sike.pona.la/jan/jan suwa/prev.html" id="prev">← {i18next.t("sikepona")[0]}</a>
          </span>
          <span id="mid"><a href="https://sike.pona.la">
            <img class="tokipona" src="https://sike.pona.la/assets/tokipona.svg" alt="toki pona"></img>
            {i18next.t("sikepona")[1]} 
            <img class="tokipona" src="https://sike.pona.la/assets/tokipona.svg" alt="toki pona"></img>
          </a></span>
          <span id="right">
            <a href="https://sike.pona.la/jan/jan suwa/next.html" id="next">{i18next.t("sikepona")[2]} →</a>
          </span>
        </div>
      </div>
      <div className="page"></div>
    </div>
  );
}

export default App;
