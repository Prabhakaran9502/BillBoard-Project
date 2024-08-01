using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using Newtonsoft.Json;
using WEbAPI.Models;

namespace WEbAPI.Controllers
{
    public class UserController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString);
        LoginUsers luser = new LoginUsers();

        [HttpPost]
        [ActionName("userList")]
        public DataSet userList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet(); 
            SqlDataAdapter da = new SqlDataAdapter("sp_User_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UserName", loginUsers.UserName);
            da.SelectCommand.Parameters.AddWithValue("@EmailId", loginUsers.EmailId );
            da.SelectCommand.Parameters.AddWithValue("@LoginFrom", loginUsers.LoginFrom);
            da.SelectCommand.Parameters.AddWithValue("@LoginTo", loginUsers.LoginTo);
            DataTable dt = new DataTable();
           da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("userEnableDisable")]
        public string userEnableDisable(LoginUsers loginUsers)
        {
            string msg = "";
            SqlDataAdapter da = new SqlDataAdapter("sp_User_Enable_Disable", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UpdatedIdValue", loginUsers.UpdatedId);
            DataTable dt = new DataTable();
            da.Fill(dt);
            if (dt.Rows.Count > 0)
            {
                msg = JsonConvert.SerializeObject(dt, Formatting.Indented);
            }
            return msg;
        }


        [HttpPost]
        [ActionName("updateUser")]
        public string updateUser(LoginUsers loginUsers)
        {
            string msg = "";
            SqlCommand cmd = new SqlCommand("sp_Update_User", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Name", loginUsers.Name);
            cmd.Parameters.AddWithValue("@Email", loginUsers.Email);
            cmd.Parameters.AddWithValue("@Password", loginUsers.Password);
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
