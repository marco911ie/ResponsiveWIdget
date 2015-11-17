package com.ibm.ie.uicomponent.filter;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class SqaFilter
 */
@WebFilter("/uicomp/*")
public class WidgetFilter implements Filter {

    /**
     * Default constructor. 
     */
    public WidgetFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here
      System.out.println("-> doFilter ");
	   String originValue = null;
	   Enumeration<String> incomingHeaders = ((HttpServletRequest)request).getHeaderNames();
	   while (incomingHeaders.hasMoreElements()) {
	      String header = incomingHeaders.nextElement();
         String value = ((HttpServletRequest)request).getHeader(header);
         System.out.println(header + " : " + value);
	      if ("Origin".equalsIgnoreCase(header)) {
	         originValue = value;
	      }
	   }
	   System.out.println("Origin: " + originValue);
      if (originValue != null)  {
         ((HttpServletResponse)response).addHeader("Access-Control-Allow-Origin", originValue);
         System.out.println("Added Access-Control-Allow-Origin: " + originValue);
         
         String accessHeaders = ((HttpServletRequest)request).getHeader("Access-Control-Request-Headers");
         if (accessHeaders != null) {
            ((HttpServletResponse)response).addHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
            ((HttpServletResponse)response).addHeader("Access-Control-Allow-Headers", "Accept, Content-Type");
            System.out.println("Added Access-Control-Allow-Methods : " + "post, get, put");
         }
      }
      System.out.println(" doFilter");

		// pass the request along the filter chain
		chain.doFilter(request, response);
      System.out.println("<- doFilter");
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
