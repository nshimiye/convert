const curlConvertor = {};

/**
 * given a string - turn it into an array of substring that are inside single quotes
 * Ex: ' \'hi there\' and \' me \' ' => [ 'hi there', 'me' ]
 */
function stringBetweenSingleQuotes(curlDataParam) {
  "use strict";
    // == START get strings inside single quotes
    let holder = [], char, savedChar, start, end;
    for (var i = 0; i < curlDataParam.length; i++) {
      char = curlDataParam.charAt(i);
      if(char === "\'" && savedChar){
        //@TODO save the substring in an array
        end = i;
        // start + 1 because we want to exclude starting \'
        holder.push( curlDataParam.substring(start+1, end) );
        savedChar = undefined;
        // counter = 0;
      } else if( char === "\'"){
        savedChar = char;
        start = i;
      } else {
        // counter++; keep going
      }
    }
    // == END get strings inside single quotes
    // console.log("conversion [ curl => json ]", holder);
    return holder;
}

/**
 * extract anything in front of -H, as a single entity ( Assume that all headers are placed inside single quotes)
 */
function getHeaders(curlDataParam) {
  "use strict";
  // == START get strings inside quotes that follow &nbsp;-H&nbsp; => [ -H ]
  let char2, start2, end2, out;
  let dashHeaders = [];
  for (var j = 0; j < curlDataParam.length - 4; j++) {
    char2 = curlDataParam.substring(j, j + 4);
    if (char2 === " -H ") {
      start2 = j + 4;
      end2 = curlDataParam.length;
      out = stringBetweenSingleQuotes( curlDataParam.substring(start2, end2) );
      if (out && out.length) {
        dashHeaders.push(out[0]);
      }
    } else {
      // keep going
    }
  }
  // == END get strings inside quotes that follow -H
  return dashHeaders;
}

/**
 * extract anything in front of --data-binary, as a single entity ( Assume that all headers are placed inside single quotes)
 * @WARNING for multipart/form-data there is a "$" that is ignored
 */
 function getBinaryData(curlDataParam) {
   "use strict";
   // == START get strings inside quotes that follow &nbsp;-H&nbsp; => [ -H ]
   let char2, start2, end2, out;
   let dashHeaders = [];
   for (let i = 0; i < curlDataParam.length - 15; i++) {
     char2 = curlDataParam.substring(i, i + 15);
     if (char2 === " --data-binary ") {
       start2 = i + 15;
       end2 = curlDataParam.length;
       out = stringBetweenSingleQuotes( curlDataParam.substring(start2, end2) );
       if (out && out.length) {
         dashHeaders.push(out[0]);
       }
     } else {
       // keep going
     }
   }
   // == END get strings inside quotes that follow -H
   return dashHeaders;
 }

/**
 * a test has shown that the endpoint url is always following curl word in chrome
 */
function chromeGetEndPoint(curlDataParam) {
  "use strict";
  let out, endpoint;
  out = stringBetweenSingleQuotes(curlDataParam);
  if (out && out.length) {
    endpoint = out[0];
  }
  return endpoint;
}


(function curlToJsonExample() {
  "use strict";

  // == START
  // @TODO use the convert-data package insted of this
  curlConvertor.to_json = function(curlData) {
    let regExp, dashHeaders, ddashHeaders, captureInQuotes, captureInSingleQuotes;
    captureInQuotes = "(\"[\w\s]+\")";
    captureInSingleQuotes = "(\'[\w\s]+\')";

    captureInQuotes = /(\"[\w\s]+\")/g;
    captureInSingleQuotes = /(\'[\w\s]+\')/g;
    // regExp = new RegExp(captureInSingleQuotes, 'g');
    dashHeaders = curlData.match(captureInSingleQuotes);
    // ddashHeaders = regExp.exec(captureInSingleQuotes);

    // let ddashHeaders = curlData.split('--header=');

    return { dashHeaders: getHeaders(curlData), ddashBinaryData: getBinaryData(curlData) };

  }
  // == END


  let curlData_ex1 = `curl 'http://fuseprospector-stage.elasticbeanstalk.com/icps' -H 'Pragma: no-cache' -H 'Origin: http://stage.fusemachines.com' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'Authorization: bearer 552ccedf-3ec5-4dea-80f0-8f0713d3a0b1' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Cache-Control: no-cache' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' -H 'Connection: keep-alive' -H 'Referer: http://stage.fusemachines.com/sales.ai/discover/generate-leads' --compressed`;
  let curlData_ex2 = `curl 'http://apps.mta.info/trainTime/getTimesByStation.aspx?stationID=L03&time=1460329632' -H 'Pragma: no-cache' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' -H 'Accept: */*' -H 'Referer: http://apps.mta.info/traintime/desktop_Rev5.html' -H 'Cookie: _ga=GA1.2.18483343.1456986755' -H 'Connection: keep-alive' -H 'Cache-Control: no-cache' --compressed`;
  let curlData_ex3 = `curl 'http://fuseprospector-stage.elasticbeanstalk.com//leads/filter?page=1&size=50' -H 'Pragma: no-cache' -H 'Origin: http://stage.fusemachines.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' -H 'Content-Type: application/json' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Cache-Control: no-cache' -H 'Authorization: bearer 1fe678f8-8df6-48fc-8f3b-cc871f24285a' -H 'Connection: keep-alive' -H 'Referer: http://stage.fusemachines.com/sales.ai/sourcing/browse' --data-binary '{"filterVOs":[{"field":"cleanStage","filterType":"must","terms":["clean"]},{"field":"sourceId","filterType":"must","terms":[]},{"field":"icpId","filterType":"must","terms":[]},{"field":"userId","filterType":"must","terms":[]},{"field":"unlink","filterType":"not","terms":[true]},{"field":"archive","filterType":"not","terms":[true]}],"queryVO":{"searchText":null,"sortBy":"createdDate","sortOrder":"desc","filterCombination":"AND","filtersQuery":[]}}' --compressed`;
  let curlData_ex4 = `curl 'http://fuseprospector-stage.elasticbeanstalk.com//lead/upload/generateHeader' -H 'Pragma: no-cache' -H 'Origin: http://stage.fusemachines.com' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: en-US,en;q=0.8,fr;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryb1lhiYURy0OmMaRY' -H 'Accept: */*' -H 'Cache-Control: no-cache' -H 'Authorization: bearer 1fe678f8-8df6-48fc-8f3b-cc871f24285a' -H 'Connection: keep-alive' -H 'Referer: http://stage.fusemachines.com/sales.ai/sourcing/upload' --data-binary $'------WebKitFormBoundaryb1lhiYURy0OmMaRY\r\nContent-Disposition: form-data; name="file"; filename="Sample+Excel+file (1).xlsx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n\r\n------WebKitFormBoundaryb1lhiYURy0OmMaRY\r\nContent-Disposition: form-data; name="mode"\r\n\r\nnull\r\n------WebKitFormBoundaryb1lhiYURy0OmMaRY--\r\n' --compressed`;
  let curlData_ex5 = `curl 'https://www.google.com/complete/search?sclient=psy-ab&espv=2&biw=1440&bih=381&site=webhp&q=hith&oq=&gs_l=&pbx=1&bav=on.2,or.r_cp.&bvm=bv.119028448,d.cWw&fp=92de209d9bd0c5fc&ion=1&pf=p&gs_rn=64&gs_ri=psy-ab&tok=GW3zTnQ-0nUxDRQ8seD0oA&pq=hi&cp=4&gs_id=i&xhr=t&tch=1&ech=3&psi=SOUKV-DJI8nl-wGH8IagDw.1460331849293.3' -H 'Referer: https://www.google.com/' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36' --compressed`;

  let jsonData = curlConvertor.to_json(curlData_ex1);
  console.log("conversion [ curl => json ]", jsonData);
  jsonData = curlConvertor.to_json(curlData_ex2);
  console.log("conversion [ curl => json ]", jsonData);
  jsonData = curlConvertor.to_json(curlData_ex3);
  console.log("conversion [ curl => json ]", jsonData);
  jsonData = curlConvertor.to_json(curlData_ex4);
  console.log("conversion [ curl => json ]", jsonData);
  jsonData = curlConvertor.to_json(curlData_ex5);
  console.log("conversion [ curl => json ]", jsonData);
  jsonData = chromeGetEndPoint(curlData_ex5)
  console.log("chrome endpoint [ curl => json ]", jsonData);
  //@TODO let curlDataTest = curlConvertor.from_json(jsonData);


})();
