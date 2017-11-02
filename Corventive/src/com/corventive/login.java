package com.corventive;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.security.auth.Subject;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import weblogic.security.URLCallbackHandler;
import weblogic.security.services.Authentication;
import weblogic.servlet.security.ServletAuthentication;

/**
 * Servlet implementation class login
 */
@WebServlet("/login")
public class login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public login() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		StringBuilder json = new StringBuilder();
		
		try {
            Subject subject =   Authentication.login(new URLCallbackHandler(username, password));
            weblogic.servlet.security.ServletAuthentication.runAs(subject, request);
            ServletAuthentication.generateNewSessionID(request);
            System.out.println("Login Successfully as " + request.getUserPrincipal().getName());
            //response.setContentType("application/json");
            json.append("{ \"username\": \"" + request.getUserPrincipal().getName() + "\"}");
            response.getWriter().write(json.toString());
           
        } catch (LoginException le) {
        	
        	
        	Connection conn = null;
    		Statement stmt = null;
    		ResultSet rs = null;
    		
    		try {
    		
    			Context initContext = new InitialContext();
    			DataSource ds = (DataSource)initContext.lookup("UsersDS");
    			conn = ds.getConnection();
    			
    			stmt = conn.createStatement();
    			
    			rs = stmt.executeQuery("SELECT U_NAME FROM USERS WHERE U_NAME = '" + username + "'");
    			
    			if(rs.next()) {
    				System.out.println("User in approval");
    				response.getWriter().append("in-approval");
    			} else {
    				System.out.println("login failed");
    				response.getWriter().append("failed");
    			}
    		
    		} catch(Exception e) {
    			System.out.println("Exception Occured: " + e.getMessage());
    			e.printStackTrace();
    		} finally {
    			try {
    				rs.close();
    				stmt.close();
    				conn.close();
    			} catch (SQLException e) {
    				// TODO Auto-generated catch block
    				e.printStackTrace();
    			}
    		}
        }
	}

}
