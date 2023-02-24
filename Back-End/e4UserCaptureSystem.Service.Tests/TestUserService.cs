using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using e4UserCaptureSystem.Service.Model;
using FluentAssertions;
using NUnit.Framework;

namespace e4UserCaptureSystem.Service.Tests
{
	public class TestUserService
	{
		[TestCase("")]
		[TestCase(" ")]
		[TestCase(null)]
		public void UserService_WhenCalledWithInvalidFilePath_ShouldThrowException(string filePath)
		{
			//------------Arrange------------
			var sut = CreateUserService();

			//------------Act---------------
			var actual = Assert.Throws<ArgumentNullException>(() =>
			{
				var userService = new UserService(filePath);
			});

			//------------Assert--------------
			actual.Should().BeOfType<ArgumentNullException>();
			actual?.Message.Should().Be("Value cannot be null. (Parameter 'filePath')");
		}

		[TestCase("hfjhh/www/")]
		[TestCase("===============")]
		[TestCase("C:\\Users\\Siphenathi\\Documents\\Dev-Time\\Personal-Project\\Job Hunting\\e4\\e4UserCaptureSystem")]
		public void UserService_WhenCalledWithNonExistingFilePath_ShouldThrowException(string filePath)
		{
			//------------Arrange------------
			var sut = CreateUserService();

			//------------Act---------------
			var actual = Assert.Throws<FileNotFoundException>(() =>
			{
				var userService = new UserService(filePath);
			});

			//------------Assert--------------
			actual.Should().BeOfType<FileNotFoundException>();
			actual?.Message.Should().Contain("No file found in this path");
		}

		[Test]
		public async Task GetUserAsync_WhenCalled_ShouldReturnAllUsers()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//------------Act------------------
			var actual = await sut.GetUsersAsync();

			//------------Assert---------------
			actual.Count().Should().BeGreaterOrEqualTo(1);
		}

		[Test]
		public void CreateUser_WhenCalledWithInvalidUser_ShouldNotSaveUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//------------Act------------------
			var actual = sut.CreateUser(null);

			//------------Assert---------------
			actual.Message.Should().Be("Provided user details are invalid");
		}

		[Test]
		public void CreateUser_WhenCalledWithValidUser_ShouldSaveFirstUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = "1",
				FirstName = "John",
				Surname = "Smith",
				Contact = "0780319837"
			};

			//------------Act------------------
			var actual = sut.CreateUser(user);

			//------------Assert---------------
			actual.Message.Should().Be("User created successfully");
		}

		[Test]
		public void CreateUser_WhenCalledWithValidUser_ShouldSaveSecondUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = "2",
				FirstName = "Sipho",
				Surname = "Gumede",
				Contact = "0785478435"
			};

			//------------Act------------------
			var actual = sut.CreateUser(user);

			//------------Assert---------------
			actual.Message.Should().Be("User created successfully");
		}

		[Test]
		public void UpdateUser_WhenCalledWithInvalidUserId_ShouldNotUpdateUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = null,
				FirstName = "User1",
				Surname = "surname1",
				Contact = "0780319837"
			};

			//--------------Act----------------
			var actual = sut.UpdateUser(user);

			//-------------Assert--------------
			actual.Message.Should().Be("Provided user details are invalid");
		}

		[Test]
		public void UpdateUser_WhenCalledWithInvalidUser_ShouldNotUpdateUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//--------------Act----------------
			var actual = sut.UpdateUser(null);

			//-------------Assert--------------
			actual.Message.Should().Be("Provided user details are invalid");
		}

		[Test]
		public void UpdateUser_WhenCalledWithNonExistingUser_ShouldNotUpdateUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = "1000",
				FirstName = "User1",
				Surname = "surname1",
				Contact = "0780319837"
			};

			//--------------Act----------------
			var actual = sut.UpdateUser(user);

			//-------------Assert--------------
			actual.Message.Should().Be("User not found");
		}

		[Test]
		public void UpdateUser_WhenCalledWithExistingUser_ShouldUpdateUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = "2",
				FirstName = "Khanyisani",
				Surname = "Gatsheni",
				Contact = "0780319837"
			};

			//--------------Act----------------
			var actual = sut.UpdateUser(user);

			//-------------Assert--------------
			actual.Message.Should().Be("User updated successfully");
		}

		[TestCase("")]
		[TestCase(" ")]
		[TestCase(null)]
		public void DeleteUser_WhenCalledWithInvalidUserId_ShouldNotDeleteUser(string userId)
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//--------------Act----------------
			var actual = sut.DeleteUser(userId);

			//-------------Assert--------------
			actual.Message.Should().Be("Provided user details are invalid");
		}

		[Test]
		public void DeleteUser_WhenCalledWithNonExistingUser_ShouldNotDeleteUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//--------------Act----------------
			var actual = sut.DeleteUser("1000");

			//-------------Assert--------------
			actual.Message.Should().Be("User not found");
		}

		[Test]
		public void DeleteUser_WhenCalledWithExistingUserId_ShouldNotDeleteUser()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//--------------Act----------------
			var actual = sut.DeleteUser("1");

			//-------------Assert--------------
			actual.Message.Should().Be("User deleted successfully");
		}

		private static IUserService CreateUserService()
		{
			//NB: File path finding is the production code. It shouldn't be here, was left with no choice or have hardcoded filepath
			var pathBase = Environment.CurrentDirectory[..Environment.CurrentDirectory.IndexOf("\\bin", StringComparison.Ordinal)];
			var filePath = Path.Combine(pathBase, "Data\\User.xml");
			return new UserService(filePath);
		}
	}
}