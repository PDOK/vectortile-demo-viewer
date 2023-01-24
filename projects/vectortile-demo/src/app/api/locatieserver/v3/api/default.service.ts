/**
 * PDOK Locatieserver
 * Dit document beschrijft de API van Locatieserver, de geocodeerservice van PDOK. Alle ondersteunde endpoints die via deze service beschikbaar komen, worden hier beschreven. Het doel van dit document is om afnemers inzicht te verschaffen hoe ze de services van Locatieserver kunnen aanspreken. Als search engine wordt Apache Solr gebruikt.  Momenteel worden 2 versies ondersteund, nl. versie 2 (v2) en versie 3 (v3). Versie 1 was de oorspronkelijke geocodeerservice. Versie 2 is de versie van Locatieserver die eind 2016 live is gegaan, met daarin alleen BAG-objecten. Versie 3 is de huidige versie. Hierin zijn ook de percelen en appartementsrechten uit de Digitale Kadastrale Kaart (DKK), het Nationaal Wegen Bestand (NWB), de waterschapsgrenzen van het Waterschapshuis, de Bestuurlijke Grenzen en de wijken en buurten uit het CBS opgenomen. Wanneer het versienummer uit de URL helemaal wordt weggelaten, wordt versie 2 geserveerd. Dit i.v.m. backward compatibility.  Wanneer een geo-referentieobject (bijv. een adres of woonplaats) d.m.v. intypen gezocht moet worden, dan moet de suggest-service gebruikt worden. Deze is geschikt voor toepassingen die gebruik maken van autocomplete, vanwege de (relatief) kleine antwoorden en het gebruik van highlighting. Wanneer hiervan een object geselecteerd wordt, kan het ID-property van één van de teruggegeven objecten worden gebruikt om meer informatie op te vragen d.m.v. de lookup-service. De vrije geocodeerservice (het \"free\" endpoint) is bedoeld voor het klassieke geocoderen, waarbij een string (een adres, e.d.) wordt meegegeven en een lijst met matches wordt teruggegeven. De vrije geocodeerservice komt het meest overeen met de functionaliteit van de oude PDOK geocoder. Voor meer informatie zie de inleidende teksten in de hoofdstukken voor de suggest-, lookup- en vrije geocoderservices.
 *
 * The version of the OpenAPI document: 3.0.0
 * Contact: beheerpdok@kadaster.nl
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec, HttpContext 
        }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';


// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class DefaultService {

   // protected basePath = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3';
   protected basePath = 'https://api.pdok.nl/bzk/locatieserver/search/v3_0'; 
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * Vrije geocoder-service
     * Deze service is bedoeld voor het vinden van zo goed mogelijke matches voor alle typen geo-referentieobjecten die in de voorziening beschikbaar zijn op basis van een opgegeven zoekterm, eventueel in combinatie met een XY-coördinaat van een locatie.
     * @param q Hiermee worden de zoektermen opgegeven. De Solr-syntax voor zoektermen kan hier worden toegepast, bijv. combineren met &#x60;and&#x60;, en het gebruik van dubbele quotes voor opeenvolgende zoektermen. Zoektermen mogen incompleet zijn. Ook wordt er gebruik gemaakt van synoniemen.
     * @param fl Hiermee worden de velden opgegeven die teruggegeven dienen te worden.
     * @param sort Hiermee kan worden opgegeven hoe de sortering plaatsvindt. De defaultwaarde is &#x60;score desc, sortering asc, weergavenaam asc&#x60;. Door voor deze string &#x60;typesortering asc&#x60; toe te voegen, kan de oude sortering worden gebruikt.
     * @param df Hiermee wordt het default zoekveld opgegeven. Dit is het veld waar standaard in gezocht wordt, wanneer de veldnaam niet wordt meegegeven.
     * @param rows Hiermee wordt opgegeven wat het maximale aantal rijen (ofwel resultaten) is dat teruggegeven moet worden op deze bevraging.
     * @param start Hiermee wordt opgegeven wat de index is van het eerste resultaat dat teruggegeven wordt. Dit is zero-based. In combinatie met de rows-parameter kunnen deze services gepagineerd worden bevraagd.
     * @param wt Hiermee wordt opgegeven wat het outputformaat is van de bevraging.
     * @param indent Hiermee kan worden opgegeven of de teruggegeven JSON ingesprongen (geïndenteerd) moet worden.
     * @param lat Werkt alleen in combinatie met &#x60;lon&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param lon Werkt alleen in combinatie met &#x60;lat&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param fq Hiermee kan een filter query worden opgegeven, bijv. &#x60;fq&#x3D;bron:BAG&#x60;. Met &#x60;fq&#x3D;*&#x60; kan de default filter query worden opgeheven.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public freeGet(q?: string, fl?: string, sort?: string, df?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public freeGet(q?: string, fl?: string, sort?: string, df?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public freeGet(q?: string, fl?: string, sort?: string, df?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public freeGet(q?: string, fl?: string, sort?: string, df?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (q !== undefined && q !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>q, 'q');
        }
        if (fl !== undefined && fl !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>fl, 'fl');
        }
        if (sort !== undefined && sort !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>sort, 'sort');
        }
        if (df !== undefined && df !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>df, 'df');
        }
        if (rows !== undefined && rows !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>rows, 'rows');
        }
        if (start !== undefined && start !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>start, 'start');
        }
        if (wt !== undefined && wt !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>wt, 'wt');
        }
        if (indent !== undefined && indent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>indent, 'indent');
        }
        if (lat !== undefined && lat !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lat, 'lat');
        }
        if (lon !== undefined && lon !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lon, 'lon');
        }
        if (fq !== undefined && fq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>fq, 'fq');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<any>(`${this.configuration.basePath}/free`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Lookup-service
     * Deze service is bedoeld voor het opvragen van informatie over één geo-referentieobject dat eerder was gevonden met behulp van de suggest-service. Deze service is specifiek bedoeld om te implementeren in combinatie met de suggest-service in een zoekveld voor geo-referentieobjecten in een applicatie. In het zoekveld zullen dan steeds op basis van het al ingetypte deel van de zoekterm enkele suggesties worden gegeven voor mogelijk gezochte objecten (wegen, adressen, plaatsen, gebieden e.d.). De lijst wordt verkort of meer exact naarmate een groter deel van het gezochte object wordt ingetypt. Vervolgens kan het gezochte object worden gekozen, waarna met behulp van de lookup-service de details van het object worden opgehaald.
     * @param id Bij de lookup-service moet de id-parameter worden gebruikt om het ID op te geven van het object waar naar gezocht dient te worden. De waarde van het ID kan worden bepaald door gebruik te maken van de suggest-service, of deze kan uit een extern systeem komen waar dit ID eerder in is opgeslagen.
     * @param rows Hiermee wordt opgegeven wat het maximale aantal rijen (ofwel resultaten) is dat teruggegeven moet worden op deze bevraging.
     * @param start Hiermee wordt opgegeven wat de index is van het eerste resultaat dat teruggegeven wordt. Dit is zero-based. In combinatie met de rows-parameter kunnen deze services gepagineerd worden bevraagd.
     * @param wt Hiermee wordt opgegeven wat het outputformaat is van de bevraging.
     * @param indent Hiermee kan worden opgegeven of de teruggegeven JSON ingesprongen (geïndenteerd) moet worden.
     * @param lat Werkt alleen in combinatie met &#x60;lon&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param lon Werkt alleen in combinatie met &#x60;lat&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param fq Hiermee kan een filter query worden opgegeven, bijv. &#x60;fq&#x3D;bron:BAG&#x60;. Met &#x60;fq&#x3D;*&#x60; kan de default filter query worden opgeheven.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public lookupGet(id: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public lookupGet(id: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public lookupGet(id: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public lookupGet(id: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling lookupGet.');
        }

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (id !== undefined && id !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>id, 'id');
        }
        if (rows !== undefined && rows !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>rows, 'rows');
        }
        if (start !== undefined && start !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>start, 'start');
        }
        if (wt !== undefined && wt !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>wt, 'wt');
        }
        if (indent !== undefined && indent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>indent, 'indent');
        }
        if (lat !== undefined && lat !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lat, 'lat');
        }
        if (lon !== undefined && lon !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lon, 'lon');
        }
        if (fq !== undefined && fq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>fq, 'fq');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<any>(`${this.configuration.basePath}/lookup`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Suggest-service
     * Deze service is bedoeld voor het vinden van suggesties voor verschillende geo-referentieobjecten o.b.v. een opgegeven zoekterm. Deze service is specifiek bedoeld om te implementeren in combinatie met de lookup service in een zoekveld voor geo-referentieobjecten in een applicatie. In het zoekveld zullen dan steeds op basis van het al ingetypte deel van de zoekterm enkele suggesties worden gegeven voor mogelijk gezochte objecten (wegen, adressen, plaatsen, gebieden e.d.). De lijst wordt verkort of meer exact naarmate een groter deel van het gezochte object wordt ingetypt. Vervolgens kan het gezochte object worden gekozen, waarna met behulp van de lookup service de details van het object worden opgehaald.
     * @param q Hiermee worden de zoektermen opgegeven. De Solr-syntax voor zoektermen kan hier worden toegepast, bijv. combineren met &#x60;and&#x60;, en het gebruik van dubbele quotes voor opeenvolgende zoektermen. Zoektermen mogen incompleet zijn. Ook wordt er gebruik gemaakt van synoniemen.
     * @param fl Hiermee worden de velden opgegeven die teruggegeven dienen te worden.
     * @param sort Hiermee kan worden opgegeven hoe de sortering plaatsvindt. De defaultwaarde is &#x60;score desc, sortering asc, weergavenaam asc&#x60;. Door voor deze string &#x60;typesortering asc&#x60; toe te voegen, kan de oude sortering worden gebruikt.
     * @param qf Met behulp van deze parameter kan aan bepaalde *velden* een extra boost worden meegegeven. Hiermee kan de scoreberekening worden aangepast. De defaultwaarde is exacte_match^1 suggest^0.5 huisnummer^0.5 huisletter^0.5 huisnummertoevoeging^0.5. Om alleen van het suggest-veld gebruik te maken, kan qf&#x3D;suggest worden meegegeven.
     * @param bq Met behulp van deze parameter kan aan bepaalde veldwaarden een extra boost worden meegegeven. Ook hiermee kan de scoreberekening worden aangepast. Dit gebeurt alleen o.b.v. de inhoud van het veld &#x60;type&#x60;. De overige typen (nog niet aanwezig) hebben geen boost. Voor elke boost query moet een aparte bq&#x3D;&lt;boost&gt; worden gebruikt. Bijvoorbeeld &#x60;bq&#x3D;type:gemeente^1.5&amp;bq&#x3D;type:woonplaats^1.5&#x60;.
     * @param rows Hiermee wordt opgegeven wat het maximale aantal rijen (ofwel resultaten) is dat teruggegeven moet worden op deze bevraging.
     * @param start Hiermee wordt opgegeven wat de index is van het eerste resultaat dat teruggegeven wordt. Dit is zero-based. In combinatie met de rows-parameter kunnen deze services gepagineerd worden bevraagd.
     * @param wt Hiermee wordt opgegeven wat het outputformaat is van de bevraging.
     * @param indent Hiermee kan worden opgegeven of de teruggegeven JSON ingesprongen (geïndenteerd) moet worden.
     * @param lat Werkt alleen in combinatie met &#x60;lon&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param lon Werkt alleen in combinatie met &#x60;lat&#x60;. Hiermee kan een coördinaat (in lat/lon, ofwel WGS84) worden opgegeven. Met behulp van deze parameters worden de gevonden zoekresultaten gesorteerd op afstand van het meegegeven punt. Wanneer de locatie van de gebruiker bekend is, kan op deze manier effectiever worden gezocht. Het meegeven van een coördinaat is met name nuttig voor de suggest- en vrije geocoder-services. Hier worden meestal meerdere resultaten teruggegeven. Als decimaal scheidingsteken moet een punt worden opgegeven i.p.v. een komma.
     * @param fq Hiermee kan een filter query worden opgegeven, bijv. &#x60;fq&#x3D;bron:BAG&#x60;. Met &#x60;fq&#x3D;*&#x60; kan de default filter query worden opgeheven.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public suggestGet(q?: string, fl?: string, sort?: string, qf?: string, bq?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any>;
    public suggestGet(q?: string, fl?: string, sort?: string, qf?: string, bq?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpResponse<any>>;
    public suggestGet(q?: string, fl?: string, sort?: string, qf?: string, bq?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<HttpEvent<any>>;
    public suggestGet(q?: string, fl?: string, sort?: string, qf?: string, bq?: string, rows?: number, start?: number, wt?: 'json' | 'xml', indent?: boolean, lat?: number, lon?: number, fq?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: undefined, context?: HttpContext}): Observable<any> {

        let localVarQueryParameters = new HttpParams({encoder: this.encoder});
        if (q !== undefined && q !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>q, 'q');
        }
        if (fl !== undefined && fl !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>fl, 'fl');
        }
        if (sort !== undefined && sort !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>sort, 'sort');
        }
        if (qf !== undefined && qf !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>qf, 'qf');
        }
        if (bq !== undefined && bq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>bq, 'bq');
        }
        if (rows !== undefined && rows !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>rows, 'rows');
        }
        if (start !== undefined && start !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>start, 'start');
        }
        if (wt !== undefined && wt !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>wt, 'wt');
        }
        if (indent !== undefined && indent !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>indent, 'indent');
        }
        if (lat !== undefined && lat !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lat, 'lat');
        }
        if (lon !== undefined && lon !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>lon, 'lon');
        }
        if (fq !== undefined && fq !== null) {
          localVarQueryParameters = this.addToHttpParams(localVarQueryParameters,
            <any>fq, 'fq');
        }

        let localVarHeaders = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        let localVarHttpContext: HttpContext | undefined = options && options.context;
        if (localVarHttpContext === undefined) {
            localVarHttpContext = new HttpContext();
        }


        let responseType_: 'text' | 'json' | 'blob' = 'json';
        if (localVarHttpHeaderAcceptSelected) {
            if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
                responseType_ = 'text';
            } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
                responseType_ = 'json';
            } else {
                responseType_ = 'blob';
            }
        }

        return this.httpClient.get<any>(`${this.configuration.basePath}/suggest`,
            {
                context: localVarHttpContext,
                params: localVarQueryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: localVarHeaders,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
