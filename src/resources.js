import { wordFromSecond, SITELEN_PONA } from './tools.js'

export const resources = {
  en: {
    translation: { 
      greeting: ["hi, i'm ", "."],
      name: timePassed => wordFromSecond(["shua", "tbdhk"], timePassed, 3000),
      aboutme: "about me",
      about: [
        ["i'm currently a high school student living in _. i study _, as well as math, physics and economics.", ["Singapore", "computing"]],
        ["i spend a lot of time _ and working on my own projects, some of which you can see below.", ["programming"]],
        ["i used to learn natlangs, but i've realised that _ and _ are much more suited to my interests.", ["toki pona", "tokiponidos"]],
        ["i also do street dance, sing, and play the piano. in my _ free time, i write and produce my own music.", ["really"]]
      ],
      subdomains: [
        { domain: "matrix", description: "my personal blog. i write about my thoughts as well as document development and other things here." },
        { domain: "wakalito", description: "learn the wakalito input method for toki pona!" }
      ],
      talk: "talk to me in ",
      language: timePassed => wordFromSecond(["english", "mandarin", "korean", "toki pona"], timePassed, 4000),
      tabs: ["home", "about me", "matrix", "wakalito", "contact"],
      sitelangs: ["english", "toki pona"],
      sikepona: ["prev", "sike pona", "next"]
    }
  },
  tp: {
    translation: { 
      greeting: ["󱥬󱤀󱦜󱤴󱤑", ""],
      name: timePassed => ("󱦐" + wordFromSecond(["󱥤󱦜󱥴󱦜", "󱥚󱥯󱥷󱤅"], timePassed, 3000, SITELEN_PONA) + "󱦑"),
      aboutme: "󱥄󱤖󱥡󱤉󱤴",
      about: [
        ["󱤴󱤑󱥍󱦗󱤖󱦕󱥡󱦘󱤬󱤰_󱦜󱤴󱤖󱦕󱥡󱤉_󱤉󱤿󱥡󱤽󱤉󱤿󱥡󱥩󱤉󱤿󱥡󱤋", ["󱦐󱥝󱦝󱤖󱦜󱥔󱦜󱦑", "󱤿󱥡󱥍󱦗󱤎󱦕󱤽󱦘"]],
        ["󱥫󱤼󱤡󱤴󱥉󱤉_󱦜󱥞󱤘󱤮󱤉󱥆󱤼󱤬󱤪󱥁", ["󱤎󱥝󱥍󱦗󱤎󱦕󱤽󱦘"]],
        ["󱥫󱥶󱤡󱤴󱤖󱦕󱥡󱤉󱥬󱥍󱦗󱥉󱤂󱦘󱦜󱥨󱥫󱥝󱤡󱤴󱤖󱦕󱥡󱤉_󱤉_", ["󱥬󱦖󱥔", "󱥬󱦕󱤚󱥍󱦗󱥬󱦖󱥔󱦘"]],
        ["󱥹󱤡󱤴󱥩󱤻󱤉󱥛󱤧󱤕󱦕󱤻󱤙󱥰󱤧󱤕󱦕󱤻󱤙󱤎󱦜󱥫󱤡󱤴_", ["󱥉󱤉󱤕󱤻󱥝"]]
      ],
      subdomains: [
        { domain: "matrix", description: "󱥁󱤧󱤪󱤴󱦜󱤴󱤪󱤉󱥎󱤴󱤉󱤿󱥉󱤉󱤆󱤼󱤬󱥁" },
        { domain: "wakalito", description: "󱥄󱤖󱦕󱥡󱤉󱤿󱥠󱦐󱦗󱥴󱦜󱤖󱦜󱤧󱦜󱥭󱦜󱦑" }
      ],
      talk: "󱥄󱥬󱥩󱤴󱤙󱥬",
      language: timePassed => wordFromSecond(["󱦐󱤌󱥁󱤧󱤍󱦑", "󱦐󱥕󱦜󱥭󱦜󱦆󱥴󱦜󱦑", "󱦐󱤀󱦆󱦈󱦝󱦑", "󱥔"], timePassed, 6000, SITELEN_PONA),
      tabs: ["󱥇", "󱥄󱤖󱥡󱤉󱤴", "󱤪󱤴", "󱤿󱥠󱦐󱦗󱥴󱦜󱤖󱦜󱤧󱦜󱥭󱦜󱦑", "󱥄󱥬󱥩󱤴"],
      sitelangs: ["󱥬󱦐󱤌󱥁󱤧󱤍󱦑", "󱥬󱦕󱥔"],
      sikepona: ["󱥒", "󱥜󱥔", "󱥒"]
    }
  }
}
