package com.ibm.ie.uicomponent.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

//import com.json.JSONObject;

/**
 * Servlet implementation class SqaServlet
 */
@WebServlet("/uicomp/*")
public class WidgetServlet extends HttpServlet {

	private static final long serialVersionUID = -8421490556172722155L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		log("-> doGet");
		execute(request, response);
		// System.out.println("request: " + request.getRequestURI());
		// if ("application/json".equals(request.getHeader("Accept")) &&
		// request.getPathInfo().contains("comments")) {
		// System.out.println("Accept json");
		// response.addHeader("Content-Type", "application/json");
		// String jsonResponse =
		// JSONObject.wrap(commentsMap.values()).toString();
		// System.out.println(jsonResponse);
		// response.getWriter().append(jsonResponse);
		//
		// }
		// else if ("application/json".equals(request.getHeader("Accept"))) {
		// System.out.println("Accept json");
		// response.addHeader("Content-Type", "application/json");
		// String jsonResponse = "{\"id\": 123, \"message\": \"yep\"}";;
		// System.out.println(jsonResponse);
		// response.getWriter().append(jsonResponse);
		// }
		// else {
		// response.getWriter().append("Served at:
		// ").append(request.getContextPath());
		// }
		log("<- doGet");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		execute(request, response);
		
	}

	private void execute(HttpServletRequest request, HttpServletResponse response) throws IOException {

		String filename;
		if (request.getPathInfo().contains("jqm")) {
			filename = "/WEB-INF/jqm-widget.html";
		} else if (request.getPathInfo().contains("bootstrap")) {
			filename = "/WEB-INF/bootstrap-widget.html";
		} else {
			filename = null;
		}

		String fileContent = readFileContent(filename, response);
		String jsonResponse = "{\"html\": \"" + fileContent + "\"}";
		response.getWriter().append(jsonResponse);
	}

	private String readFileContent(String filename, HttpServletResponse response) {

		if (filename == null) {
			return "";
		}

		ServletContext context = getServletContext();
		InputStream is = context.getResourceAsStream(filename);
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();

		String line;
		try {

			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
			}

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}

		return sb.toString().replace("\n", " ").replace("\t", " ");

	}

}
