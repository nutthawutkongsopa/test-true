using System;
using System.Collections.Generic;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using TestTrue.Core;
using TestTrue.Models;

namespace TestTrue.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult SearchUser(UserCriteria criteria)
        {
            using (var db = new Model1())
            {
                var query = db.Users.Where(FilterUser(criteria));
                var result = query.OrderBy(t => t.Username).Select(userToModel).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult GetUser(int id)
        {
            using (var db = new Model1())
            {
                var query = db.Users.Where(t => t.Id == id);
                var result = query.Select(userToModel).FirstOrDefault();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public void SaveUser(UserModel data)
        {
            using (var db = new Model1())
            {
                var user = db.Users.Where(t => t.Id == data.Id).FirstOrDefault();
                if (user == null)
                {
                    user = new User();
                    user.CreatedDate = DateTime.Now;
                    user.CreatedBy = "admin";
                    db.Users.Add(user);
                }

                user.Address = data.Address;
                user.DistrictId = data.DistrictId;
                user.Email = data.Email;
                user.FirstName = data.FirstName;
                user.LastName = data.LastName;
                user.ProvinceId = data.ProvinceId;
                user.SubDistrictId = data.SubDistrictId;
                user.UpdatedBy = "admin";
                user.UpdatedDate = DateTime.Now;
                user.Username = data.Username;
                db.SaveChanges();
            }
        }

        [HttpPost]
        public void RemoveUser(int id)
        {
            using (var db = new Model1())
            {
                var user = db.Users.Where(t => t.Id == id).FirstOrDefault();
                if (user != null)
                {
                    db.Users.Remove(user);
                    db.SaveChanges();
                }
            }
        }

        [HttpGet]
        public ActionResult GetAllProvince()
        {
            using (var db = new Model1())
            {
                var result = db.Provinces.OrderBy(t => t.Name).Select(t => new ProvinceModel()
                {
                    Id = t.Id,
                    Name = t.Name
                }).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetDistrict(int provinceId)
        {
            using (var db = new Model1())
            {
                var result = db.Districts.Where(t => t.ProvinceId == provinceId).OrderBy(t => t.Name).Select(t => new DistrictModel()
                {
                    Name = t.Name,
                    Id = t.Id,
                    ProvinceId = t.ProvinceId
                }).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult GetSubDistrict(int districtId)
        {
            using (var db = new Model1())
            {
                var result = db.SubDistricts.Where(t => t.DistrictId == districtId).OrderBy(t => t.Name).Select(t => new SubDistrictModel()
                {
                    DistrictId = t.DistrictId,
                    Id = t.Id,
                    Name = t.Name
                }).ToList();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        Expression<Func<User, UserModel>> userToModel = t => new UserModel()
        {
            Address = t.Address,
            DistrictId = t.DistrictId,
            Email = t.Email,
            FirstName = t.FirstName,
            Id = t.Id,
            LastName = t.LastName,
            ProvinceId = t.ProvinceId,
            SubDistrictId = t.SubDistrictId,
            Username = t.Username,
            CreatedBy = t.CreatedBy,
            CreatedDate = t.CreatedDate,
            UpdatedBy = t.UpdatedBy,
            UpdatedDate = t.UpdatedDate
        };
        private Expression<Func<User, bool>> FilterUser(UserCriteria criteria)
        {
            Expression<Func<User, bool>> result = t => true;
            if (!string.IsNullOrWhiteSpace(criteria.FirstName))
                result = result.And(t => SqlFunctions.PatIndex("%" + criteria.FirstName + "%", t.FirstName) > 0);
            if (!string.IsNullOrWhiteSpace(criteria.LastName))
                result = result.And(t => SqlFunctions.PatIndex("%" + criteria.LastName + "%", t.LastName) > 0);
            return result;
        }
    }
}