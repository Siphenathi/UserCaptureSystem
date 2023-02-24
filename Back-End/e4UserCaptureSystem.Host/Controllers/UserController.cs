using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using e4UserCaptureSystem.Host.Model;
using e4UserCaptureSystem.Service;
using e4UserCaptureSystem.Service.Model;
using Microsoft.AspNetCore.Mvc;

namespace e4UserCaptureSystem.Host.Controllers
{
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		[Route("api/v1/[controller]")]
		public async Task<ActionResult<IEnumerable<User>>> GetUsersAsync()
		{
			var users = await _userService.GetUsersAsync();
			return !users.Any() ? StatusCode(404, "No user found yet!") : new ActionResult<IEnumerable<User>>(users);
		}

		[HttpPost]
		[Route("api/v1/[controller]/Create")]
		public async Task<ActionResult> Create(UserRegistrationViewModel userRegistrationViewModel)
		{
			try
			{
				if(await UserExist(userRegistrationViewModel))
					return StatusCode(400, "User already exist!");
				var transactionResponse = _userService.CreateUser(MapToUser(userRegistrationViewModel));
				if (transactionResponse.FeedBackType == FeedBackType.Warning)
					return NotFound(transactionResponse.Message);
				return transactionResponse.FeedBackType == FeedBackType.Success ? 
					StatusCode(200, transactionResponse.Message) : 
					StatusCode(400, transactionResponse.Message);
			}
			catch (Exception exception)
			{
				return StatusCode(500, exception.Message);
			}
		}

		[HttpPost]
		[Route("api/v1/[controller]/Update")]
		public Task<ActionResult> Update(UserUpdateViewModel userUpdateViewModel)
		{
			try
			{
				var transactionResponse = _userService.UpdateUser(MapToUser(userUpdateViewModel));
				if (transactionResponse.FeedBackType == FeedBackType.Warning)
					return Task.FromResult<ActionResult>(NotFound(transactionResponse.Message));
				return Task.FromResult<ActionResult>(transactionResponse.FeedBackType == FeedBackType.Success ?
					StatusCode(200, transactionResponse.Message) :
					StatusCode(400, transactionResponse.Message));
			}
			catch (Exception exception)
			{
				return Task.FromResult<ActionResult>(StatusCode(500, exception.Message));
			}
		}

		[HttpDelete]
		[Route("api/v1/[controller]/Delete/{userId}")]
		public  ActionResult Create(string userId)
		{
			try
			{
				var transactionResponse = _userService.DeleteUser(userId);
				if (transactionResponse.FeedBackType == FeedBackType.Warning)
					return NotFound(transactionResponse.Message);
				return transactionResponse.FeedBackType == FeedBackType.Success
					? StatusCode(200, transactionResponse.Message)
					: StatusCode(400, transactionResponse.Message);
			}
			catch (Exception exception)
			{
				return StatusCode(500, exception.Message);
			}
		}

		private async Task<bool> UserExist(UserRegistrationViewModel userRegistrationViewModel)
		{
			var users = await _userService.GetUsersAsync();
			return users.ToList().Exists(x => x.FirstName.Equals(userRegistrationViewModel.FirstName, StringComparison.CurrentCultureIgnoreCase)
			                                   && x.Surname.Equals(userRegistrationViewModel.Surname, StringComparison.CurrentCultureIgnoreCase)
			                                   && x.Contact.Equals(userRegistrationViewModel.Contact));
		}

		private static User MapToUser(UserRegistrationViewModel userRegistrationViewModel)
		{
			return new User
			{
				UserId = Guid.NewGuid().ToString(),
				FirstName = userRegistrationViewModel.FirstName,
				Surname = userRegistrationViewModel.Surname,
				Contact = userRegistrationViewModel.Contact
			};
		}

		private static User MapToUser(UserUpdateViewModel userUpdateViewModel)
		{
			return new User
			{
				UserId = userUpdateViewModel.UserId,
				FirstName = userUpdateViewModel.FirstName,
				Surname = userUpdateViewModel.Surname,
				Contact = userUpdateViewModel.Contact
			};
		}
	}
}
