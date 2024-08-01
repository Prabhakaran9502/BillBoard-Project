using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WEbAPI.Models
{
    public class LoginUsers
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public int IsTermsConfirm { get; set; }
        public int IsActive { get; set; }
        public string LoginToken { get; set; }
        public string UpdatedId { get; set; }
        public int UserId { get; set; }
        public int BrandId { get; set; }
        public int ProductId { get; set; }
        public string UpdatedQtyList { get; set; }
        public int Qty { get; set; }
        public int StockId { get; set; }
        public string EmailId { get; set; }
        public string UserName { get; set; }
        public string LoginFrom { get; set; }
        public string LoginTo { get; set; }
        public string RemovalId { get; set; }
        public string ProductName { get; set; }
        public string UpdatedProductList { get; set; }
        public string BrandName { get; set; }
        public string UpdatedBrandList { get; set; }
    }
}