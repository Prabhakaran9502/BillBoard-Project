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
    public class ProductController : ApiController
    {
        SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["con"].ConnectionString);
        LoginUsers luser = new LoginUsers();

        [HttpPost]
        [ActionName("productStockList")]
        public DataSet productStockList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_Stock_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UserId", loginUsers.UserId);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            da.SelectCommand.Parameters.AddWithValue("@ProductId", loginUsers.ProductId);
            da.SelectCommand.Parameters.AddWithValue("@UserName", loginUsers.UserName);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("usersListForStockAdd")]
        public DataSet usersListForStockAdd(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Users_List_Stock_Add", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("brandListForStockAdd")]
        public DataSet brandListForStockAdd(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_List_Stock_Add", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@UserId", loginUsers.UserId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("productListForStockAdd")]
        public DataSet productListForStockAdd(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_List_Stock_Add", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@UserId", loginUsers.UserId);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("productDetails")]
        public DataSet productDetails(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_Details", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@UserId", loginUsers.UserId);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            da.SelectCommand.Parameters.AddWithValue("@ProductId", loginUsers.ProductId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("addStockQty")]
        public DataSet addStockQty(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Add_Product_Stock", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UpdatedQtyList", loginUsers.UpdatedQtyList);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("updateStockQty")]
        public DataSet updateStockQty(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Update_Product_Stock", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@Qty", loginUsers.Qty);
            da.SelectCommand.Parameters.AddWithValue("@StockId", loginUsers.StockId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("brandListForFilter")]
        public DataSet brandListForFilter(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_List_For_Filter", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("productListForFilter")]
        public DataSet productListForFilter(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_List_For_Filter", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("productList")]
        public DataSet productList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UserId", loginUsers.UserId);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            da.SelectCommand.Parameters.AddWithValue("@ProductId", loginUsers.ProductId);
            da.SelectCommand.Parameters.AddWithValue("@UserName", loginUsers.UserName);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("userProductStockList")]
        public DataSet userProductStockList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_User_Product_Stock_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            da.SelectCommand.Parameters.AddWithValue("@ProductId", loginUsers.ProductId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("removeProductStock")]
        public DataSet removeProductStock(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Remove_Product_Stock", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@RemovalId", loginUsers.RemovalId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("brandListForProductAdd")]
        public DataSet brandListForProductAdd(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_List_Product_Add", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("productSuggestionList")]
        public DataSet productSuggestionList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Product_Suggestion_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            da.SelectCommand.Parameters.AddWithValue("@ProductName", loginUsers.ProductName);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("addProduct")]
        public DataSet addProduct(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Add_Product", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UpdatedProductList", loginUsers.UpdatedProductList);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("brandList")]
        public DataSet brandList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("brandUserList")]
        public DataSet brandUserList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_User_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

        [HttpPost]
        [ActionName("brandUserListforRemove")]
        public DataSet brandUserListforRemove(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_List_For_Remove", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandId", loginUsers.BrandId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("removeBrandStock")]
        public DataSet removeBrandStock(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Remove_Brand_Stock", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@RemovalId", loginUsers.RemovalId);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }


        [HttpPost]
        [ActionName("brandSuggestionList")]
        public DataSet brandSuggestionList(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Brand_Suggestion_List", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@BrandName", loginUsers.BrandName);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }



        [HttpPost]
        [ActionName("addBrand")]
        public DataSet addBrand(LoginUsers loginUsers)
        {
            DataSet ds = new DataSet();
            SqlDataAdapter da = new SqlDataAdapter("sp_Add_Brand", con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            da.SelectCommand.Parameters.AddWithValue("@LoginToken", loginUsers.LoginToken);
            da.SelectCommand.Parameters.AddWithValue("@UpdatedBrandList", loginUsers.UpdatedBrandList);
            DataTable dt = new DataTable();
            da.Fill(ds);
            return ds;
        }

    }
}