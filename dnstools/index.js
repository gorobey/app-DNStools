'use strict';
const defaultDomain = 'dwarfstar.co.nz';
var dns = require('dns');  // https://nodejs.org/api/dns.html#dns_dns_getservers 
// var Q = require('q');
// var ndns = require('native-dns');  //?

//ToDo:  DNS Timeout, other configuration?
var dns_options = {
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
    family: 6,
  };

const handleError =function(e){
    console.error(e);
};

//ToDo: Add ipV6, Cname, ANY? lookups
const dnsResolve = function(domainName=defaultDomain) {
    var p = new Promise((resolve, reject) => {
        const rrtype = 'A';  //https://nodejs.org/api/dns.html#dns_dns_resolve_hostname_rrtype_callback 
        dns.resolve(domainName, rrtype, function (e, addr){
            if (e) {
                // Return NotFound as resolved 
                if (e.code == 'ENOTFOUND'){
                    let j = {'resolve': {domainName: domainName, addr: 'ENOTFOUND'}};
                    resolve(j);
                } else {reject(e);}  
            } else {
                let r;
                if (Array.isArray(addr)){
                    r = addr.join(',');
                } else {
                    r = addr;
                }
                let j = {'resolve': {domainName: domainName, addr: r}};
                resolve(j);
            }
        });
    });
    return p;
};

const dnsNS = function (domainName) {
    var p = new Promise((resolve, reject) => {
        dns.resolveNs(domainName, function (e, addr){
            if (e) {reject(e);}  
            else {
                //{"type":"ns","domainName":"magicmemories.com","addr":["ns-1199.awsdns-21.org","ns-1612.awsdns-09.co.uk","ns-375.awsdns-46.com","ns-911.awsdns-49.net"]}
                let j = {'ns': {domainName: domainName, addr: addr}};
                // ToDo: Enum IP addresses
                // for (let a in addr){
                //     console.log(addr[a]);
                //}
                resolve(j);
            }
        });
    });
    return p;
};

const dnsTXT = function (domainName) {
    var p = new Promise((resolve, reject) => {
        dns.resolveTxt(domainName, function (e, addr){
            if (e) {reject(e);}  
            else {
                //{"type":"ns","domainName":"magicmemories.com","addr":["ns-1199.awsdns-21.org","ns-1612.awsdns-09.co.uk","ns-375.awsdns-46.com","ns-911.awsdns-49.net"]}
                let j = {'txt': { domainName: domainName, addr: addr}};
                resolve(j);
            }
        });
    });
    return p;
};

const dnsMX = function(domainName=defaultDomain) {
    var p = new Promise((resolve, reject) => {
        dns.resolveMx(domainName, function (e, addr){
            if (e) {
                console.error('dnsMx error.', e);
                reject(e);}
            else {
                //{"type":"mx","domainName":"magicmemories.com","addr":[{"exchange":"aspmx.l.google.com","priority":0},{"exchange":"alt1.aspmx.l.google.com","priority":10},{"exchange":"alt2.aspmx.l.google.com","priority":10},{"exchange":"aspmx2.googlemail.com","priority":20},{"exchange":"aspmx3.googlemail.com","priority":20}]}
                let pResults = [];
                let j = {'mx': {domainName: domainName, addr: addr}};
                let r = {'mx': {domainName: domainName, addr: addr}};

                for (let a in addr) {
                    let mxrecord = addr[a].exchange;
                    pResults.push(dnsResolve(mxrecord));
                }

                Promise.all(pResults)
                .then((v) => {
//                  //ToDo Map and\or Reduce
                    for (let t in v){
                        //console.log(v[t].resolve.addr);
                        //console.log('mx', r.mx.addr[t]);
                        //console.log('valueAdd', v[t].resolve.addr);
                        r.mx.addr[t].ip = v[t].resolve.addr;
                    }
                    resolve(r);
                })
                .catch((e) => handleError(e));
            }
        });
    });
    return p;
};

function dnsALL(domainName){
    let pResults = [];
    let r = {all:[]};
    let p = new Promise((resolve, reject) => {
        pResults.push (dnsNS(domainName));
        pResults.push (dnsMX(domainName));
        pResults.push (dnsTXT(domainName));
        pResults.push (dnsGeneral(domainName));

        Promise.all(pResults)
        .then((v) => {
            //ToDo Map and\or Reduce
            for (let t in v){
                r.all.push((v[t]));
            }
//            console.log('Returning: r', JSON.stringify(r));
            resolve(r);
        })
        .catch((e) => {
            handleError(e);
            reject(e);
        });
    });
    return p;
}

function dnsGeneral(domainName){
    const hostnames = ['autodiscover',
        'smtp',
        'owa',
        'webmail',
        'www'];

    // More dns records to check.
    //const otherhostnames = ['*', '@', 'lincdiscover', 'sip', 'vpn']
    
    let resultsReturned = {general: []};
//    const h = hostnames.map(u => dnsResolve(console.log(u + '.' + domainName)));
     
    //ToDo Replace with Map
    const funcs = [];
    for (let host in hostnames){
        let fullurl = hostnames[host] + '.' + domainName;
        console.log('FullURL:', fullurl);
        funcs.push(dnsResolve(fullurl));    
        }
 
    var p = new Promise((resolve, reject) => {
        // Example from https://stackoverflow.com/questions/30362733/handling-errors-in-promise-all
        Promise.all(funcs)
        .then(r => {
            // ToDo: handling of my array containing values and/or errors.
            for (let i in r){
                resultsReturned.general.push(r[i].resolve);
            }
            resolve(resultsReturned);
        })
        .catch(e => {
            console.error('PromiseAll Catch:', e.message); // some coding error in handling happened
            reject({'Error': e});
        });
    });
    return(p);
}

// ToDo: Use a testing framework and move to a seperate file
function test(){
let t = dnsALL('magicmemories.com')
  .then( r => console.log('Return dnsAll results', JSON.stringify(r)))
  .catch(e => {
            console.error('e', e);
        });
    }

module.exports ={
    dnsALL: dnsALL,
    dnsGeneral: dnsGeneral,
    dnsMX: dnsMX,
    dnsNS: dnsNS,
    dnsResolve: dnsResolve,
    dnsTXT: dnsTXT
};
