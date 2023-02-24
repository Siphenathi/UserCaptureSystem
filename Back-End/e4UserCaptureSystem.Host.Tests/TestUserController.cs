using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using e4UserCaptureSystem.Host.Controllers;
using e4UserCaptureSystem.Host.Model;
using e4UserCaptureSystem.Service;
using e4UserCaptureSystem.Service.Model;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NUnit.Framework;

namespace e4UserCaptureSystem.Host.Tests
{
	public class Tests
	{
		[Test]
		public async Task GetUsers_WhenCalled_ShouldReturnAllUsers()
		{
			//Arrange
			var userService = Substitute.For<IUserService>();
			CreateGetUsersStub(userService);

			var userController = CreateUserController(userService);

			//Act
			var actual = await userController.GetUsers();

			//Assert
			await userService.Received(1).GetUsersAsync();
			actual.Value.Count().Should().Be(2);
		}

		[Test]
		public async Task Create_WhenCalledWithUserDetails_ShouldCreateUser()
		{
			//Arrange
			var userRegistrationViewModel = new UserRegistrationViewModel
			{
				FirstName = "Khanyisani",
				Surname = "Gatsheni",
				Contact = "0780319837"
			};

			var userService = Substitute.For<IUserService>();
			CreateUserStub(userService);

			var userController = CreateUserController(userService);

			//Act
			var actual = (ObjectResult)await userController.Create(userRegistrationViewModel);

			//Assert
			userService.Received(1).CreateUser(Arg.Is<User>(entity =>
				entity.FirstName == "Khanyisani"));
			actual.Value.Should().Be("All good");
		}

		[Test]
		public async Task Update_WhenCalledWithUserDetails_ShouldUpdateUser()
		{
			//Arrange
			var userUpdateViewModel = new UserUpdateViewModel
			{
				UserId = "t54y45y",
				FirstName = "Khanyisani",
				Surname = "Gatsheni",
				Contact = "0780319837"
			};

			var userService = Substitute.For<IUserService>();
			UpdateUserStub(userService);

			var userController = CreateUserController(userService);

			//Act
			var actual = (ObjectResult)await userController.Update(userUpdateViewModel);

			//Assert
			userService.Received(1).UpdateUser(Arg.Is<User>(entity =>
				entity.UserId == "t54y45y"));
			actual.Value.Should().Be("User is not found");
		}

		[Test]
		public void Delete_WhenCalledWithUserId_ShouldDeleteUser()
		{
			//Arrange
			var userService = Substitute.For<IUserService>();
			DeleteUserStub(userService);

			var userController = CreateUserController(userService);

			//Act
			var actual = (ObjectResult)userController.Delete("3y33y3");

			//Assert
			userService.Received(1).DeleteUser(Arg.Is("3y33y3"));
			actual.Value.Should().Be("User has been deleted successfully");
		}

		private static void CreateGetUsersStub(IUserService userService)
		{
			userService.GetUsersAsync().Returns(new List<User>
			{
				new User
				{
					UserId = "1000",
					FirstName = "User1",
					Surname = "surname1",
					Contact = "0780319837"
				},
				new User
				{
					UserId = "2",
					FirstName = "Khanyisani",
					Surname = "Gatsheni",
					Contact = "0780319837"
				}
			});
		}

		private static void CreateUserStub(IUserService userService)
		{
			userService.CreateUser(Arg.Any<User>()).Returns(new TransactionResponse
			{
				FeedBackType = FeedBackType.Success,
				Message = "All good"
			});
		}

		private static void UpdateUserStub(IUserService userService)
		{
			userService.UpdateUser(Arg.Any<User>()).Returns(new TransactionResponse
			{
				FeedBackType = FeedBackType.Warning,
				Message = "User is not found"
			});
		}

		private static void DeleteUserStub(IUserService userService)
		{
			userService.DeleteUser(Arg.Any<string>()).Returns(new TransactionResponse
			{
				FeedBackType = FeedBackType.Warning,
				Message = "User has been deleted successfully"
			});
		}

		private static UserController CreateUserController(IUserService userService)
		{
			return new UserController(userService);
		}
	}
}