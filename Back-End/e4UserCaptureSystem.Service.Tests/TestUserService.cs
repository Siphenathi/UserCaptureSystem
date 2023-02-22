using System;
using System.Linq;
using System.Threading.Tasks;
using e4UserCaptureSystem.Service.Model;
using FluentAssertions;
using NUnit.Framework;

namespace e4UserCaptureSystem.Service.Tests
{
	public class TestUserService
	{
		[Test]
		public async Task GetUserAsync_WhenCalled_ShouldReturnAllUsersFromXmlFile()
		{
			//------------Arrange--------------
			var sut = CreateUserService();

			//------------Act------------------
			var actual = await sut.GetUsersAsync();

			//------------Assert---------------
			actual.Count().Should().BeGreaterOrEqualTo(1);
		}

		[Test]
		public async Task Do()
		{
			//------------Arrange--------------
			var sut = CreateUserService();
			var user = new User
			{
				UserId = Guid.NewGuid().ToString(),
				FirstName = "John",
				Surname = "Smith",
				Contact = "0780319834"
			};

			//------------Act------------------
			sut.CreateUser(user);
			var users = await sut.GetUsersAsync();

			//------------Assert---------------
			users.Count().Should().Be(3);
		}

		private static UserService CreateUserService()
		{
			return new UserService("Data/User.xml");
		}
	}
}