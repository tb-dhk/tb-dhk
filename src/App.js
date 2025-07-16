import './App.css';
import { useState, useEffect, useRef } from 'react'
import i18next from 'i18next'

import { Icon } from '@iconify/react'
import githubIcon from '@iconify/icons-fa-brands/github'
import discordIcon from '@iconify/icons-fa-brands/discord'
import instagramIcon from '@iconify/icons-fa-brands/instagram'

import { resources } from './resources.js'
import { oneTimeWordFromSecond } from './tools.js'

function height() {
  return window.visualViewport?.height || window.innerHeight 
}

function Glow(props) {
  return <span className="glow-text">{props.content}</span>
}

function pageUp(x, unit) {
  const floored = Math.floor(x / unit)
  return (x / unit) - floored < 0.25 ? (floored - 1) * unit : floored * unit
}

function pageDown(x, unit) {
  const ceiled = Math.ceil(x / unit)
  return ceiled - (x / unit) < 0.25 ? (ceiled + 1) * unit : ceiled * unit
}

function clamp(num, lower, upper) {
  return Math.min(Math.max(num, lower), upper)
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
  const [domainStartTime, setDomainStartTime] = useState(Date.now());
  const [subdomains, setSubdomains] = useState([null, "matrix"])
  const [scrolled, setScrolled] = useState(0)

  const languages = ["en", "tp"] 

  const scrollTimeout = useRef(null)
  
  i18next.init({
    lng: language,
    resources: resources,
    returnObjects: true
  })

  const pages = i18next.t("tabs")

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        window.scrollTo({ top: pageDown(window.scrollY, height()), behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        window.scrollTo({ top: pageUp(window.scrollY, height()), behavior: 'smooth' })
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
    }, 16) // roughly 60fps update

    return () => clearInterval(intervalId);
  }, [startTime]);

  useEffect(() => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    const onScroll = () => {
      const scrollVh = window.scrollY / height()
      const newVal = Math.round(scrollVh)

      // only proceed if the scroll target changed
      if (scrolled !== newVal) {
        setScrolled(newVal)
        setDomainStartTime(Date.now())

        setSubdomains(prev => {
          const next = i18next.t("subdomains")[clamp(newVal - 2, 0, i18next.t("subdomains").length - 1)].domain
          if (prev[1] !== next) {
            return [prev[1], next]
          } else {
            return prev 
          }
        })
      }
    }

    scrollTimeout.current = setTimeout(() => {
      window.scrollTo({ top: Math.round(window.scrollY / height()) * height(), behavior: 'smooth' })
    }, 100) 

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrolled])

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
      <div className="scroll" style={{height: (100 * subdomains.length) + "vh"}}>
        <div className="sticky subdomain">
          <div className="header url" onClick={() => window.open("https://" + i18next.t("subdomains")[clamp(scrolled - 2, 0, i18next.t("subdomains").length - 1)].domain + ".tbdhk.xyz")}>
            <Glow content={`${oneTimeWordFromSecond(subdomains, Date.now() - domainStartTime, 250)}.tbdhk.xyz`} />
          </div>
          <div>{i18next.t("subdomains")[clamp(scrolled - 2, 0, i18next.t("subdomains").length - 1)].description}</div>
        </div>
      </div>
      <div 
        className="button"
        id="page-up"
        onClick={() => {
          window.scrollTo({ top: pageUp(window.scrollY, height()), behavior: 'smooth' })
        }}
      >
        {scrolled ? <Icon icon="oui:arrow-up" /> : null}
      </div>
      <div 
        className="button"
        id="page-down"
        onClick={() => {
          window.scrollTo({ top: pageDown(window.scrollY, height()), behavior: 'smooth' })
        }}
      >
      {scrolled < 2 + i18next.t("subdomains").length ? <Icon icon="oui:arrow-down" /> : null}
      </div>
      <div className="page">
        <div className="about-header">{i18next.t("talk")}<Glow content={i18next.t("language")(timePassed)}/>:</div>
        <div className="icon-tray">
          <Icon icon={githubIcon} onClick={() => window.open("https://github.com/tb-dhk")} />
          <Icon icon={discordIcon} onClick={() => window.open("https://discord.com/users/876607304236163102")} />
          <Icon icon={instagramIcon} onClick={() => window.open("https://www.instagram.com/tbdhk_/")} />
        </div>
      </div>
    </div>
  );
}

export default App;
