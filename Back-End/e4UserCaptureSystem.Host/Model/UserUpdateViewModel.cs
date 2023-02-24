using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace e4UserCaptureSystem.Host.Model
{
	public class UserUpdateViewModel
	{
		[Required]
		public string UserId { get; set; }
		[Required]
		public string FirstName { get; set; }
		[Required]
		public string Surname { get; set; }
		[Required]
		[StringLength(10, MinimumLength = 10, ErrorMessage = "Contact number length must be equal to 10 digits ")]
		[RegularExpression(@"^\(?([0]{1})\)?[-. ]?([1-9]{1})[-. ]?([0-9]{8})$", ErrorMessage = "Invalid phone number format")]
		public string Contact { get; set; }
	}
}
