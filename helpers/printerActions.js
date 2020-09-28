

export const printMessage = (xml = null, ipAddress, successCallback, errorCallback) => {

  const url = `http://${ipAddress}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=5000`

  let request = `<epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">`
  request += '<text lang="en"/>'
  request += '<text align="center"/>'
  request += '<text width="1" height="2"/>'
  request += '<text>Printer Test Result&#10;</text>'
  request += '<feed line="1"/>'
  request += '<text width="1" height="1"/>'
  request += '<text>Your printer is connected correctly&#10;</text>'
  request += '<feed line="1"/>'
  request += '<cut type="feed"/>'
  request += '</epos-print>'
  let soap = `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Body>${request}</s:Body></s:Envelope>`;
  if (xml !== null) {
    soap = xml
  }

  console.log(soap)

  const xhr = new XMLHttpRequest();

  //Open an XMLHttpRequest object
  xhr.open('POST', url);
  //<Header settings>
  xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8')
  xhr.setRequestHeader('SOAPAction', '""')
  xhr.timeout = 5000
  xhr.ontimeout = () => {
    errorCallback()
  }

  xhr.onreadystatechange = () => { // Call a function when the state changes.
    console.log(`response: ${xhr.status} ${xhr.readyState}`)

    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      successCallback()
    } else {
      console.log("Error sending print request")
      errorCallback()
    }
  }

  xhr.send(soap);

}
