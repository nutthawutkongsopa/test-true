using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestTrue.Models
{
    public class UserCriteria
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class UserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public int? ProvinceId { get; set; }
        public int? DistrictId { get; set; }
        public int? SubDistrictId { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedDateDisplay { get { return CreatedDate?.ToString("dd/MM/yyyy"); } }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedDateDisplay { get { return UpdatedDate?.ToString("dd/MM/yyyy"); } }
    }

    public class ProvinceModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class DistrictModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProvinceId { get; set; }
    }

    public class SubDistrictModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int DistrictId { get; set; }
    }
}