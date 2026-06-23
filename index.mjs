function logError(request, message) {
  console.error(
    `${message}, clientIp: ${request.headers.get(
      "cf-connecting-ip"
    )}, user-agent: ${request.headers.get("user-agent")}, url: ${request.url}`
  );
}

function createNewRequest(request, url, proxyHostname, originHostname) {
  const newRequestHeaders = new Headers(request.headers);
  for (const [key, value] of newRequestHeaders) {
    if (value.includes(originHostname)) {
      newRequestHeaders.set(
        key,
        value.replace(
          new RegExp(`(?<!\\.)\\b${originHostname}\\b`, "g"),
          proxyHostname
        )
      );
    }
  }
  return new Request(url.toString(), {
    method: request.method,
    headers: newRequestHeaders,
    body: request.body,
  });
}

function setResponseHeaders(
  originalResponse,
  proxyHostname,
  originHostname,
  DEBUG
) {
  const newResponseHeaders = new Headers(originalResponse.headers);
  for (const [key, value] of newResponseHeaders) {
    if (value.includes(proxyHostname)) {
      newResponseHeaders.set(
        key,
        value.replace(
          new RegExp(`(?<!\\.)\\b${proxyHostname}\\b`, "g"),
          originHostname
        )
      );
    }
  }
  if (DEBUG) {
    newResponseHeaders.delete("content-security-policy");
  }
  return newResponseHeaders;
}

/**
 * 替换内容
 * @param originalResponse 响应
 * @param proxyHostname 代理地址 hostname
 * @param pathnameRegex 代理地址路径匹配的正则表达式
 * @param originHostname 替换的字符串
 * @returns {Promise<*>}
 */
async function replaceResponseText(
  originalResponse,
  proxyHostname,
  pathnameRegex,
  originHostname
) {
  let text = await originalResponse.text();
  if (pathnameRegex) {
    pathnameRegex = pathnameRegex.replace(/^\^/, "");
    return text.replace(
      new RegExp(`((?<!\\.)\\b${proxyHostname}\\b)(${pathnameRegex})`, "g"),
      `${originHostname}$2`
    );
  } else {
    return text.replace(
      new RegExp(`(?<!\\.)\\b${proxyHostname}\\b`, "g"),
      originHostname
    );
  }
}

// 判断是否是静态资源
function isStaticAsset(path) {
  return /\.(js|mjs|cjs|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|map|json|xml|mp4|webm|txt|pdf|webmanifest|wasm|whl|pfb|icc)$/i.test(path)
}

export default {
  async fetch(request, env) {
    try {
      let
        PROXY_HOSTNAME = 'pages',
        PROXY_PROTOCOL = "https",
        DEBUG = false;
      if (request.url.indexOf('/api/') !== -1) {
        PROXY_HOSTNAME = 'iapi.pdn.express';
      } else if (request.url.indexOf('/financeApi/') !== -1) {
        PROXY_HOSTNAME = 'finance-api.pdn.express';
      } else if (request.url.indexOf('/reportApi/') !== -1) {
        PROXY_HOSTNAME = 'report-api.pdn.express';
      }
      const url = new URL(request.url.replace('/financeApi/', '/').replace('/reportApi/', '/').replace('/api/', '/'));
      const originHostname = url.hostname;
      let originalResponse
      // 静态资源直接放行
      if (isStaticAsset(url.pathname)) {
        originalResponse = await env.ASSETS.fetch(request)
      } else if (PROXY_HOSTNAME === 'pages') {
        let hostname = originHostname.split('.')[0]
        let dir = hostname
        let newPathname = url.pathname
        const langList = [
          'zh',
          'en',
          'fr',
          'es',
          'pt',
          'de',
          'jp',
        ]
        // 定义一个不需要重定向的路径白名单
        const noRedirectPaths = [
          "/baidu_verify_codeva-mLRhHWXOP9.html",
          "/yandex_7867df180bcf464b.html",
        ];
        if (noRedirectPaths.includes(newPathname)) {
          return env.ASSETS.fetch(new Request(
            `https://fake-host/${newPathname}`,
            { method: request.method }
          ));
        }

        if (!langList.includes(hostname)) {
          dir = 'en'
        }
        if (langList.includes(newPathname.split('/')[1])) {
          dir = ''
          newPathname = newPathname.slice(1)
        }
        // 去掉尾部 /
        if (newPathname.endsWith("/") && newPathname !== "/") {
          newPathname = newPathname.slice(0, -1)
        }
        if (newPathname === '/') {
          if (!langList.includes(hostname)) {
            newPathname = `/`;
          } else {
            newPathname = `/${dir}/`;
          }
        } else {
          newPathname = `/${dir}${newPathname.toLocaleLowerCase()}/index.html`;
        }
        const modifiedRequest = new Request(
          `https://fake-host/${newPathname}`,
          { method: request.method }
        );
        originalResponse = await env.ASSETS.fetch(modifiedRequest);
      } else {
        url.host = PROXY_HOSTNAME;
        url.protocol = PROXY_PROTOCOL;
        const newRequest = createNewRequest(
          request,
          url,
          PROXY_HOSTNAME,
          originHostname
        );
        originalResponse = await fetch(newRequest);
      }
      const newResponseHeaders = setResponseHeaders(
        originalResponse,
        PROXY_HOSTNAME,
        originHostname,
        DEBUG
      );
      let body = originalResponse.body;
      let status = originalResponse.status
      if (status === 404) {
        status = 200
      }
      if (isStaticAsset(url.pathname)) {
        newResponseHeaders.set("Cache-Control", "max-age=31536000");
      }
      return new Response(body, {
        status: status, // originalResponse.status,
        headers: newResponseHeaders,
      });
    } catch (error) {
      logError(request, `Fetch error: ${error.message}`);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
