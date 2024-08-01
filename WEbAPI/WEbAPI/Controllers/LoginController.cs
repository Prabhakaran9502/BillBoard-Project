using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using WEbAPI.Models;
using Newtonsoft.Json;

namespace WEbAPI.Controllers
{
    public class LoginController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString);
        LoginUsers luser = new LoginUsers();


        [HttpPut]
        [ActionName("login")]
        public string login(LoginUsers loginUsers)
        {
            string msg = "";
            var guid = Guid.NewGuid().ToString();
            SqlDataAdapter da = new SqlDataAdapter("sp_Login_Verification", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@Email", loginUsers.Email);
            da.SelectCommand.Parameters.AddWithValue("@Password", loginUsers.Password);
            da.SelectCommand.Parameters.AddWithValue("@LoginToken",guid);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if(dt.Rows.Count>0)
            {
                msg = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            return msg;
        }


        [HttpPut]
        [ActionName("logout")]
        public string logout(LoginUsers loginUsers)
        {
            string msg = "";
            SqlDataAdapter da = new SqlDataAdapter("sp_Logout_Verification", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                msg = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            return msg;
        }


        [HttpPost]
        [ActionName("loginDetails")]
        public DataSet loginDetails(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Login_Details", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }




        [HttpPost]
        [ActionName("addUser")]
        public string addUser(LoginUsers loginUsers)
        {
            string msg = "";
            SqlCommand cmd = new SqlCommand("sp_Add_User", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", loginUsers.Name);
            cmd.Parameters.AddWithValue("@Email", loginUsers.Email);
            cmd.Parameters.AddWithValue("@Password", loginUsers.Password);
            cmd.Parameters.AddWithValue("@IsTermsConfirm", loginUsers.IsTermsConfirm);
            cmd.Parameters.AddWithValue("@IsActive", loginUsers.IsActive);
            con.Open();
            int i = cmd.ExecuteNonQuery();
            con.Close();
            if (i > 0)
            {
                msg = "Successfull";
            }
            else
            {
                msg = "Failed";
            }
            return msg;
        }

 
    }
}
