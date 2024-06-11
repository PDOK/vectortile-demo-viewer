import { TestBed } from '@angular/core/testing'

import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { Collection, CollectionResponse, FeatureCollectionResponse, IdlookupService, OGCApiLink } from './idlookup.service'


describe('IdlookupService', () => {
  let service: IdlookupService
  let httpMock: HttpTestingController


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()]
    })
    service = TestBed.inject(IdlookupService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })


  it('should be created', () => {
    expect(service).toBeTruthy()
  })


  /* it('should return undefined if not exists', () => {
    // Mock the HTTP request and response
    const mockResponse = null // Define the expected response
    service.GetId('notexists', '').subscribe((response: unknown) => {
      expect(response).toEqual(mockResponse)
    })
  
    const req = httpMock.expectOne(`https://api.example.com/collections/notexists`)
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse) // Simulate a response from the server
  })
    */

  it('should return 0 collections on empty', () => {
    // Mock the HTTP request and response
    const mockResponse: CollectionResponse = { links: [], collections: [] } // Define the expected response
    service.getItemLinks("https://api.example.com").subscribe((response: OGCApiLink[]) => {
      expect(response.length).toEqual(0)
    })

    const req = httpMock.expectOne(`https://api.example.com/collections`)
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse) // Simulate a response from the server
  })

  it('should getCollections return Collection[] on testBGT', () => {
    // Mock the HTTP request and response
    const mockResponse = aTestResponse// Define the expected response
    service.getCollections("https://api.example.com").subscribe((response: Collection[]) => {
      expect(response.length).toEqual(49)
      expect(response[0].id).toEqual('bak')
      expect(response[0].title).toEqual('Bak (BAK)')
    })

    const req = httpMock.expectOne(`https://api.example.com/collections`)
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse) // Simulate a response from the server
  })



  it('should return OGCApiLink[] on testBGT', () => {
    // Mock the HTTP request and response
    const mockResponse = aTestResponse// Define the expected response
    service.getItemLinks("https://api.example.com").subscribe((response: OGCApiLink[]) => {
      expect(response.length).toEqual(49)
      expect(response[0].href).toEqual('https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak/items?f=json')
      expect(response[0].title).toEqual('The JSON representation of the bak features served from this endpoint')
      expect(response[0].type).toEqual("application/geo+json")
      expect(response[0].rel).toEqual("items")

    })

    const req = httpMock.expectOne(`https://api.example.com/collections`)
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse) // Simulate a response from the server
  })

  it('should return false if lokaalid does not exits', () => {
    const mockResponse: FeatureCollectionResponse = {
      numberReturned: 0,
      type: '',
      timeStamp: new Date("2024-06-11T14:15:30Z"),
      coordRefSys: '',
      links: [],
      conformsTo: [],
      features: []
    }

    service.existsIdForFeature("https://demo/collections/xxx/items?f=a", '1').subscribe((response) => {
      expect(response).toEqual(false)
    })
    const req = httpMock.expectOne(`https://demo/collections/xxx/items?f=a&lokaal_id=1`)

    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  it('should return  if lokaalid exits', () => {
    const mockResponse: FeatureCollectionResponse = {
      numberReturned: 1,
      type: '',
      timeStamp: new Date("2024-06-11T14:15:30Z"),
      coordRefSys: '',
      links: [],
      conformsTo: [],
      features: []
    }

    service.existsIdForFeature("https://demo/collections/xxx/items?f=a", '1').subscribe((response) => {
      expect(response).toEqual(mockResponse)
    })
    const req = httpMock.expectOne(`https://demo/collections/xxx/items?f=a&lokaal_id=1`)

    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  /* it('should return  if lokaalid from all endpoints exits', () => {
     const mockResponse = aTestResponse
     const mockResponse2: FeatureCollectionResponse = {
       numberReturned: 1,
       type: '',
       timeStamp: new Date("2024-06-11T14:15:30Z"),
       coordRefSys: '',
       links: [],
       conformsTo: [],
       features: []
     }
     service.existsIdForFeature("https://demo", '1').subscribe((response) => {
       expect(response).toEqual(false)
     })
     const req = httpMock.expectOne("https://demo&lokaal_id=1")
     expect(req.request.method).toBe('GET')
     req.flush(mockResponse2)
     req.flush(mockResponse)
  
   })
     */
})

const aTestResponse = {
  "links": [
    {
      "rel": "self",
      "type": "application/json",
      "title": "This document as JSON",
      "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections?f=json"
    },
    {
      "rel": "alternate",
      "type": "text/html",
      "title": "This document as HTML",
      "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections?f=html"
    },
    {
      "rel": "license",
      "type": "text/html",
      "title": "CC0 1.0",
      "href": "http://creativecommons.org/publicdomain/zero/1.0/deed.nl"
    }
  ],
  "collections": [
    {
      "id": "bak",
      "title": "Bak (BAK)",
      "description": "Object met een permanent karakter dat dient om iets in te bergen of te verzamelen.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the bak collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the bak collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the bak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the bak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the bak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bak/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "begroeidterreindeel",
      "title": "Begroeid terreindeel (BTD)",
      "description": "Kleinste functioneel onafhankelijk stukje van een terrein dat er binnen het objecttype Terrein van NEN 3610 wordt onderscheiden, met aaneengesloten vegetatie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the begroeidterreindeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the begroeidterreindeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the begroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the begroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the begroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "begroeidterreindeel_kruinlijn",
      "title": "Begroeid terreindeel kruinlijn (BTD_kruinlijn)",
      "description": "Lijngeometrie van de hoogstgelegen begrenzing van een kunstmatig aangelegd en onderhouden helling.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the begroeidterreindeel_kruinlijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel_kruinlijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the begroeidterreindeel_kruinlijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel_kruinlijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the begroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel_kruinlijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the begroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel_kruinlijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the begroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/begroeidterreindeel_kruinlijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "bord",
      "title": "Bord (BRD)",
      "description": "Een paneel waarop informatie wordt afgebeeld.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the bord collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bord?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the bord collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bord?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the bord features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bord/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the bord features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bord/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the bord features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/bord/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "buurt",
      "title": "Buurt (BRT)",
      "description": "Een aaneengesloten gedeelte van een wijk, waarvan de grenzen zoveel mogelijk zijn gebaseerd op topografische elementen.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the buurt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/buurt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the buurt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/buurt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the buurt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/buurt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the buurt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/buurt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the buurt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/buurt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "functioneelgebied",
      "title": "Functioneel gebied (FUG)",
      "description": "Begrensd en benoemd gebied dat door een functionele eenheid beschreven wordt.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the functioneelgebied collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/functioneelgebied?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the functioneelgebied collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/functioneelgebied?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the functioneelgebied features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/functioneelgebied/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the functioneelgebied features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/functioneelgebied/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the functioneelgebied features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/functioneelgebied/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "gebouwinstallatie",
      "title": "Gebouwinstallatie (GBI)",
      "description": "Een component aan de buitenzijde van een gebouw, die het aanzicht van het gebouw mede bepaalt.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the gebouwinstallatie collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/gebouwinstallatie?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the gebouwinstallatie collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/gebouwinstallatie?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the gebouwinstallatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/gebouwinstallatie/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the gebouwinstallatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/gebouwinstallatie/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the gebouwinstallatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/gebouwinstallatie/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "installatie",
      "title": "Installatie (INS)",
      "description": "Samenhangend systeem dat een bepaald doel dient.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the installatie collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/installatie?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the installatie collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/installatie?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the installatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/installatie/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the installatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/installatie/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the installatie features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/installatie/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "kast",
      "title": "Kast (KST)",
      "description": "Object met een permanent karakter dat dient om iets in te bergen en te beschermen.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the kast collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kast?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the kast collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kast?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the kast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kast/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the kast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kast/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the kast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kast/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "kunstwerkdeel_lijn",
      "title": "Kunstwerkdeel lijn (KWD)",
      "description": "Onderdeel van een civiel-technisch werk voor de infrastructuur van wegen, water, spoorbanen, waterkeringen en/of leidingen. Kunstwerken bevatten onderstaande types. Voor meer informatie over deze types en de inwinningsregels zie IMGeo.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the kunstwerkdeel_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the kunstwerkdeel_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the kunstwerkdeel_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the kunstwerkdeel_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the kunstwerkdeel_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "kunstwerkdeel_punt",
      "title": "Kunstwerkdeel punt (KWD)",
      "description": "Onderdeel van een civiel-technisch werk voor de infrastructuur van wegen, water, spoorbanen, waterkeringen en/of leidingen. Kunstwerken bevatten onderstaande types. Voor meer informatie over deze types en de inwinningsregels zie IMGeo.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the kunstwerkdeel_punt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_punt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the kunstwerkdeel_punt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_punt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the kunstwerkdeel_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_punt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the kunstwerkdeel_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_punt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the kunstwerkdeel_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_punt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "kunstwerkdeel_vlak",
      "title": "Kunstwerkdeel vlak (KWD)",
      "description": "Onderdeel van een civiel-technisch werk voor de infrastructuur van wegen, water, spoorbanen, waterkeringen en/of leidingen. Kunstwerken bevatten onderstaande types. Voor meer informatie over deze types en de inwinningsregels zie IMGeo.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the kunstwerkdeel_vlak collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_vlak?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the kunstwerkdeel_vlak collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_vlak?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the kunstwerkdeel_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_vlak/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the kunstwerkdeel_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_vlak/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the kunstwerkdeel_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/kunstwerkdeel_vlak/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "mast",
      "title": "Mast (MST)",
      "description": "Hoge draagconstructie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the mast collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/mast?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the mast collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/mast?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the mast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/mast/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the mast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/mast/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the mast features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/mast/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "onbegroeidterreindeel",
      "title": "Onbegroeid terreindeel (OTD)",
      "description": "Kleinste functioneel onafhankelijk stukje van een terrein, dat er binnen het objecttype Terrein van NEN 3610 wordt onderscheiden, zonder aaneengesloten vegetatie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the onbegroeidterreindeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the onbegroeidterreindeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the onbegroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the onbegroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the onbegroeidterreindeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "onbegroeidterreindeel_kruinlijn",
      "title": "Onbegroeid terreindeel kruinlijn (OTD_kruinlijn)",
      "description": "Lijngeometrie van de hoogstgelegen begrenzing van een kunstmatig aangelegd en onderhouden helling.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the onbegroeidterreindeel_kruinlijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel_kruinlijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the onbegroeidterreindeel_kruinlijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel_kruinlijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the onbegroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel_kruinlijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the onbegroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel_kruinlijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the onbegroeidterreindeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/onbegroeidterreindeel_kruinlijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "ondersteunendwaterdeel",
      "title": "Ondersteunend waterdeel (OWT)",
      "description": "Object dat in het kader van de waterhuishouding periodiek gedeeltelijk of geheel met water is bedekt.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the ondersteunendwaterdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwaterdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the ondersteunendwaterdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwaterdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the ondersteunendwaterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwaterdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the ondersteunendwaterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwaterdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the ondersteunendwaterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwaterdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "ondersteunendwegdeel",
      "title": "Ondersteunend wegdeel (OWG)",
      "description": "Een deel van de weg dat niet primair bedoeld is voor gebruik door het verkeer.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the ondersteunendwegdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the ondersteunendwegdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the ondersteunendwegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the ondersteunendwegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the ondersteunendwegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "ondersteunendwegdeel_kruinlijn",
      "title": "Ondersteunend wegdeel kruinlijn (OWG_kruinlijn)",
      "description": "Lijngeometrie van de hoogstgelegen begrenzing van een kunstmatig aangelegd en onderhouden helling.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the ondersteunendwegdeel_kruinlijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel_kruinlijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the ondersteunendwegdeel_kruinlijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel_kruinlijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the ondersteunendwegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel_kruinlijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the ondersteunendwegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel_kruinlijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the ondersteunendwegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ondersteunendwegdeel_kruinlijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "ongeclassificeerdobject",
      "title": "Ongeclassificeerd object (Historisch)",
      "description": "Deze Features zijn sinds 2020 geen onderdeel meer van het BGT/IMGeo model. Er komen dan ook geen actuele objecten in de collection voor. Voor historische redenen zijn de objecten toch opvraagbaar.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the ongeclassificeerdobject collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ongeclassificeerdobject?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the ongeclassificeerdobject collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ongeclassificeerdobject?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the ongeclassificeerdobject features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ongeclassificeerdobject/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the ongeclassificeerdobject features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ongeclassificeerdobject/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the ongeclassificeerdobject features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/ongeclassificeerdobject/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "openbareruimte",
      "title": "Openbare ruimte (OPR)",
      "description": "Een OPENBARE RUIMTE is een door het bevoegde gemeentelijke orgaan als zodanig aangewezen en van een naam voorziene buitenruimte die binnen één woonplaats is gelegen.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the openbareruimte collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimte?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the openbareruimte collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimte?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the openbareruimte features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimte/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the openbareruimte features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimte/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the openbareruimte features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimte/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "openbareruimtelabel",
      "title": "Openbare ruimte label (ORL)",
      "description": "Naam en plaatsingspunten van een in de BAG geregistreerde OPENBARE RUIMTE.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the openbareruimtelabel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimtelabel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the openbareruimtelabel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimtelabel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the openbareruimtelabel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimtelabel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the openbareruimtelabel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimtelabel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the openbareruimtelabel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/openbareruimtelabel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "overbruggingsdeel",
      "title": "Overbruggingsdeel (OBD)",
      "description": "Onderdeel van een beweegbare of vaste verbinding tussen twee punten, die door water, een weg of anderszins gescheiden zijn, dat essentieel is voor de constructie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the overbruggingsdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the overbruggingsdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the overbruggingsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the overbruggingsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the overbruggingsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overbruggingsdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "overigbouwwerk",
      "title": "Overig bouwwerk (OBW)",
      "description": "Met de aarde verbonden duurzaam bouwwerk, dat niet valt onder de definities van een pand of kunstwerk.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the overigbouwwerk collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigbouwwerk?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the overigbouwwerk collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigbouwwerk?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the overigbouwwerk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigbouwwerk/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the overigbouwwerk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigbouwwerk/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the overigbouwwerk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigbouwwerk/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "overigescheiding",
      "title": "Overige scheiding (Historisch)",
      "description": "Deze Features zijn sinds 2020 geen onderdeel meer van het BGT/IMGeo model. Er komen dan ook geen actuele objecten in de collection voor. Voor historische redenen zijn de objecten toch opvraagbaar.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the overigescheiding collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigescheiding?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the overigescheiding collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigescheiding?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the overigescheiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigescheiding/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the overigescheiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigescheiding/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the overigescheiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/overigescheiding/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "paal",
      "title": "Paal (PAL)",
      "description": "Langwerpig stuk hout, ijzer, steen enz., dat in de grond staat.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the paal collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/paal?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the paal collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/paal?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the paal features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/paal/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the paal features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/paal/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the paal features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/paal/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "pand",
      "title": "Pand (PND)",
      "description": "Een PAND is de kleinste bij de totstandkoming functioneel en bouwkundig-constructief zelfstandige eenheid die direct en duurzaam met de aarde is verbonden en betreedbaar en afsluitbaar is.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the pand collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the pand collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the pand features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the pand features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the pand features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "pand_nummeraanduiding",
      "title": "Pand nummeraanduiding (PND_huisnr)",
      "description": "Bevat de reeks nummeraanduidingen behorend bij het pand ten behoeve van visualisatie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the pand_nummeraanduiding collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand_nummeraanduiding?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the pand_nummeraanduiding collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand_nummeraanduiding?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the pand_nummeraanduiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand_nummeraanduiding/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the pand_nummeraanduiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand_nummeraanduiding/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the pand_nummeraanduiding features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/pand_nummeraanduiding/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "put",
      "title": "Put (PUT)",
      "description": "Gegraven of geboorde kokervormige diepte waarin zich (vloei)stoffen bevinden.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the put collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/put?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the put collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/put?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the put features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/put/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the put features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/put/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the put features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/put/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "scheiding_lijn",
      "title": "Scheiding lijn (SHD)",
      "description": "Kunstmatig obstakel met een werende functie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the scheiding_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the scheiding_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the scheiding_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the scheiding_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the scheiding_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "scheiding_vlak",
      "title": "Scheiding vlak (SHD)",
      "description": "Kunstmatig obstakel met een werende functie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the scheiding_vlak collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_vlak?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the scheiding_vlak collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_vlak?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the scheiding_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_vlak/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the scheiding_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_vlak/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the scheiding_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/scheiding_vlak/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "sensor_lijn",
      "title": "Sensor lijn (SNS)",
      "description": "Apparaat voor de meting van een fysieke grootheid (bijv. temperatuur, licht, druk, elektriciteit).",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the sensor_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the sensor_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the sensor_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the sensor_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the sensor_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "sensor_punt",
      "title": "Sensor punt (SNS)",
      "description": "Apparaat voor de meting van een fysieke grootheid (bijv. temperatuur, licht, druk, elektriciteit).",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the sensor_punt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_punt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the sensor_punt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_punt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the sensor_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_punt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the sensor_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_punt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the sensor_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/sensor_punt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "spoor",
      "title": "Spoor (SPR)",
      "description": "De as van het spoor, dat wil zeggen het midden van twee stalen staven op een onderling vaste afstand, waarover trein, tram, of sneltram rijdt.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the spoor collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/spoor?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the spoor collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/spoor?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the spoor features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/spoor/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the spoor features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/spoor/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the spoor features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/spoor/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "stadsdeel",
      "title": "Stadsdeel (STD)",
      "description": "Deel van een stad, wijk.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the stadsdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/stadsdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the stadsdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/stadsdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the stadsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/stadsdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the stadsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/stadsdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the stadsdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/stadsdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "straatmeubilair",
      "title": "Straatmeubilair (STM)",
      "description": "Een ruimtelijk object ter inrichting van de openbare ruimte.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the straatmeubilair collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the straatmeubilair collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the straatmeubilair features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the straatmeubilair features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the straatmeubilair features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/straatmeubilair/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "tunneldeel",
      "title": "Tunneldeel (TUN)",
      "description": "Onderdeel van een kunstmatig aangelegde, kokervormige onderdoorgang dat essentieel is voor de constructie.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the tunneldeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/tunneldeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the tunneldeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/tunneldeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the tunneldeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/tunneldeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the tunneldeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/tunneldeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the tunneldeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/tunneldeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "vegetatieobject_lijn",
      "title": "Vegetatieobject lijn (VGO)",
      "description": "Solitair vegetatieobject of lijn- of vlakvormige groep gelijksoortige vegetatieobjecten met een beperkte omvang.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the vegetatieobject_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the vegetatieobject_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the vegetatieobject_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the vegetatieobject_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the vegetatieobject_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "vegetatieobject_punt",
      "title": "Vegetatieobject punt (VGO)",
      "description": "Solitair vegetatieobject of lijn- of vlakvormige groep gelijksoortige vegetatieobjecten met een beperkte omvang.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the vegetatieobject_punt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_punt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the vegetatieobject_punt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_punt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the vegetatieobject_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_punt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the vegetatieobject_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_punt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the vegetatieobject_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_punt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "vegetatieobject_vlak",
      "title": "Vegetatieobject vlak (VGO)",
      "description": "Solitair vegetatieobject of lijn- of vlakvormige groep gelijksoortige vegetatieobjecten met een beperkte omvang.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the vegetatieobject_vlak collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_vlak?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the vegetatieobject_vlak collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_vlak?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the vegetatieobject_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_vlak/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the vegetatieobject_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_vlak/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the vegetatieobject_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/vegetatieobject_vlak/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "waterdeel",
      "title": "Waterdeel (WTD)",
      "description": "Kleinste functioneel onafhankelijk stukje water met gelijkblijvende, homogene eigenschappen en relaties dat er binnen het objecttype Water van NEN 3610 wordt onderscheiden en dat permanent met water bedekt is.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the waterdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the waterdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the waterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the waterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the waterdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "waterinrichtingselement_lijn",
      "title": "Waterinrichtingselement lijn (WTI)",
      "description": "Een ruimtelijk object ter inrichting van het water.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the waterinrichtingselement_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the waterinrichtingselement_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the waterinrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the waterinrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the waterinrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "waterinrichtingselement_punt",
      "title": "Waterinrichtingselement punt (WTI)",
      "description": "Een ruimtelijk object ter inrichting van het water.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the waterinrichtingselement_punt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_punt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the waterinrichtingselement_punt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_punt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the waterinrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_punt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the waterinrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_punt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the waterinrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterinrichtingselement_punt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "waterschap",
      "title": "Waterschap (WSP)",
      "description": "Regionaal gebied onder het bestuur van een overheidsinstantie (waterschap) die tot taak heeft de waterhuishouding in dit gebied te regelen.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the waterschap collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterschap?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the waterschap collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterschap?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the waterschap features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterschap/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the waterschap features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterschap/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the waterschap features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/waterschap/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "wegdeel",
      "title": "Wegdeel (WGD)",
      "description": "Kleinste functioneel onafhankelijk stukje van een NEN 3610 Weg met gelijkblijvende, homogene eigenschappen en relaties en primair bedoeld voor gebruik door weg-, spoor- en vliegverkeer te land.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the wegdeel collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the wegdeel collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the wegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the wegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the wegdeel features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "wegdeel_kruinlijn",
      "title": "Wegdeel kruinlijn (WGD_kruinlijn)",
      "description": "Lijngeometrie van de hoogstgelegen begrenzing van een kunstmatig aangelegd en onderhouden helling.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the wegdeel_kruinlijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel_kruinlijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the wegdeel_kruinlijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel_kruinlijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the wegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel_kruinlijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the wegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel_kruinlijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the wegdeel_kruinlijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wegdeel_kruinlijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "weginrichtingselement_lijn",
      "title": "Weginrichtingselement lijn (WGI)",
      "description": "Een ruimtelijk object dat dient voor de inrichting van de openbare weg.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the weginrichtingselement_lijn collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_lijn?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the weginrichtingselement_lijn collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_lijn?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the weginrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_lijn/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the weginrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_lijn/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the weginrichtingselement_lijn features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_lijn/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "weginrichtingselement_punt",
      "title": "Weginrichtingselement punt (WGI)",
      "description": "Een ruimtelijk object dat dient voor de inrichting van de openbare weg.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the weginrichtingselement_punt collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_punt?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the weginrichtingselement_punt collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_punt?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the weginrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_punt/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the weginrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_punt/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the weginrichtingselement_punt features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_punt/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "weginrichtingselement_vlak",
      "title": "Weginrichtingselement vlak (WGI)",
      "description": "Een ruimtelijk object dat dient voor de inrichting van de openbare weg.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the weginrichtingselement_vlak collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_vlak?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the weginrichtingselement_vlak collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_vlak?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the weginrichtingselement_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_vlak/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the weginrichtingselement_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_vlak/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the weginrichtingselement_vlak features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/weginrichtingselement_vlak/items?f=html"
        }
      ],
      "content": []
    },
    {
      "id": "wijk",
      "title": "Wijk (WYK)",
      "description": "Een aaneengesloten gedeelte van het grondgebied van een gemeente, waarvan de grenzen zoveel mogelijk zijn gebaseerd op sociaalgeografische kenmerken.",
      "extent": {
        "spatial": {
          "bbox": [
            [
              -1.657292,
              48.040502,
              12.431727,
              56.110590
            ]
          ],
          "crs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84"
        },
        "temporal": {
          "interval": [
            [
              "1970-01-01T00:00:00Z",
              null
            ]
          ],
          "trs": "http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"
        }
      },
      "crs": [
        "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        "http://www.opengis.net/def/crs/EPSG/0/28992",
        "http://www.opengis.net/def/crs/EPSG/0/3857",
        "http://www.opengis.net/def/crs/EPSG/0/4258"
      ],
      "storageCrs": "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
      "links": [
        {
          "rel": "self",
          "type": "application/json",
          "title": "Information about the wijk collection as JSON",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wijk?f=json"
        },
        {
          "rel": "alternate",
          "type": "text/html",
          "title": "Information about the wijk collection as HTML",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wijk?f=json"
        },
        {
          "rel": "items",
          "type": "application/geo+json",
          "title": "The JSON representation of the wijk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wijk/items?f=json"
        },
        {
          "rel": "items",
          "type": "application/vnd.ogc.fg+json",
          "title": "The JSON-FG representation of the wijk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wijk/items?f=jsonfg"
        },
        {
          "rel": "items",
          "type": "text/html",
          "title": "The HTML representation of the wijk features served from this endpoint",
          "href": "https://api.pdok.nl/lv/bgt/ogc/v1/collections/wijk/items?f=html"
        }
      ],
      "content": []
    }
  ]
}
