/* eslint no-constant-condition: "off" */

const d3 = require('d3')
const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each'),
}

const InputSanitizer = require('./inputSanitizer')
const Radar = require('../models/radar')
const Quadrant = require('../models/quadrant')
const Ring = require('../models/ring')
const Blip = require('../models/blip')
const GraphingRadar = require('../graphing/radar')
const MalformedDataError = require('../exceptions/malformedDataError')
const SheetNotFoundError = require('../exceptions/sheetNotFoundError')
const ContentValidator = require('./contentValidator')
const ExceptionMessages = require('./exceptionMessages')

const sheet = require('../../../content/radar.csv')

const plotRadar = function (title, blips, currentRadarName, alternativeRadars) {
  document.title = title
  d3.selectAll('.loading').remove()

  var rings = _.map(_.uniqBy(blips, 'ring'), 'ring')
  var ringMap = {}
  var maxRings = 4

  _.each(rings, function (ringName, i) {
    if (i === maxRings) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS)
    }
    ringMap[ringName] = new Ring(ringName, i)
  })

  var quadrants = {}
  _.each(blips, function (blip) {
    if (!quadrants[blip.quadrant]) {
      quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant))
    }
    quadrants[blip.quadrant].add(
      new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description),
    )
  })

  var radar = new Radar()
  _.each(quadrants, function (quadrant) {
    radar.addQuadrant(quadrant)
  })

  if (alternativeRadars !== undefined || true) {
    alternativeRadars.forEach(function (sheetName) {
      radar.addAlternative(sheetName)
    })
  }

  if (currentRadarName !== undefined || true) {
    radar.setCurrentSheet(currentRadarName)
  }

  var size = window.innerHeight - 133 < 620 ? 620 : window.innerHeight - 133

  new GraphingRadar(size, radar).init().plot()
}

const CSVDocument = function () {
  var self = {}

  self.build = function () {
    createBlips(sheet)
  }

  var createBlips = function (data) {
    try {
      var columnNames = Object.keys(data[0])
      var contentValidator = new ContentValidator(columnNames)
      contentValidator.verifyContent()
      contentValidator.verifyHeaders()
      var blips = _.map(data, new InputSanitizer().sanitize)
      plotRadar('XPRTZ Technology Radar', blips, 'CSV File', [])
    } catch (exception) {
      plotErrorMessage(exception)
    }
  }

  self.init = function () {
    plotLoading()
    return self
  }

  return self
}

const GoogleSheetInput = function () {
  var self = {}
  var sheet

  self.build = function () {
    sheet = CSVDocument()
    sheet.init().build()
  }

  return self
}

function setDocumentTitle() {
  document.title = 'XPRTZ Technology Radar'
}

function plotLoading(content) {
  content = d3.select('body').append('div').attr('class', 'loading').append('div').attr('class', 'input-sheet')

  setDocumentTitle()

  plotLogo(content)

  var bannerText = '<h1>Building your radar...</h1><p>Your Technology Radar will be available in just a few seconds</p>'
  plotBanner(content, bannerText)
  plotFooter(content)
}

function plotLogo(content) {
  content
    .append('div')
    .attr('class', 'input-sheet__logo')
    .html('<a href="https://www.thoughtworks.com"><img src="/images/tw-logo.png" / ></a>')
}

function plotFooter(content) {
  content
    .append('div')
    .attr('id', 'footer')
    .append('div')
    .attr('class', 'footer-content')
    .append('p')
    .html(
      'Powered by <a href="https://www.thoughtworks.com"> Thoughtworks</a>. ' +
        'By using this service you agree to <a href="https://www.thoughtworks.com/radar/tos">Thoughtworks\' terms of use</a>. ' +
        'You also agree to our <a href="https://www.thoughtworks.com/privacy-policy">privacy policy</a>, which describes how we will gather, use and protect any personal data contained in your public Google Sheet. ' +
        'This software is <a href="https://github.com/thoughtworks/build-your-own-radar">open source</a> and available for download and self-hosting.',
    )
}

function plotBanner(content, text) {
  content.append('div').attr('class', 'input-sheet__banner').html(text)
}

function plotErrorMessage(exception) {
  var message = 'Oops! It seems like there are some problems with loading your data. '

  var content = d3.select('body').append('div').attr('class', 'input-sheet')
  setDocumentTitle()

  plotLogo(content)

  var bannerText =
    '<div><h1>Build your own radar</h1><p>Once you\'ve <a href ="https://www.thoughtworks.com/radar/byor">created your Radar</a>, you can use this service' +
    ' to generate an <br />interactive version of your Technology Radar. Not sure how? <a href ="https://www.thoughtworks.com/radar/how-to-byor">Read this first.</a></p></div>'

  plotBanner(content, bannerText)

  d3.selectAll('.loading').remove()
  message = "Oops! We can't find the Google Sheet you've entered"
  var faqMessage =
    'Please check <a href="https://www.thoughtworks.com/radar/how-to-byor">FAQs</a> for possible solutions.'
  if (exception instanceof MalformedDataError) {
    message = message.concat(exception.message)
  } else if (exception instanceof SheetNotFoundError) {
    message = exception.message
  } else {
    console.error(exception)
  }

  const container = content.append('div').attr('class', 'error-container')
  var errorContainer = container.append('div').attr('class', 'error-container__message')
  errorContainer.append('div').append('p').html(message)
  errorContainer.append('div').append('p').html(faqMessage)

  var homePageURL = window.location.protocol + '//' + window.location.hostname
  homePageURL += window.location.port === '' ? '' : ':' + window.location.port
  var homePage = '<a href=' + homePageURL + '>GO BACK</a>'

  errorContainer.append('div').append('p').html(homePage)

  plotFooter(content)
}

module.exports = GoogleSheetInput
