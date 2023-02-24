using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using e4UserCaptureSystem.Service.Model;

namespace e4UserCaptureSystem.Service
{
	public class UserService : IUserService
	{
		private string FilePath { get; }
		private const string User = "User";
		private const string UserId = "UserId";
		private const string FirstName = "FirstName";
		private const string Surname = "Surname";
		private const string Contact = "Contact";

		public UserService(string filePath)
		{
			FilePath = filePath;
		}
		//NB : IUserService.Method Force the use of interface instead of concrete implementation in declaration 

		Task<IEnumerable<User>> IUserService.GetUsersAsync()
		{
			var xDoc = XDocument.Load(FilePath);
			var collectionOfDescendentElements = xDoc.Root?.Descendants(User);
			var users = collectionOfDescendentElements?.Select(xElement => 
				new User
				{
					UserId = xElement.Element(UserId)?.Value,
					FirstName = xElement.Element(FirstName)?.Value,
					Surname = xElement.Element(Surname)?.Value,
					Contact = xElement.Element(Contact)?.Value
				}).ToList();

			return Task.FromResult<IEnumerable<User>>(users);
		}

		TransactionResponse IUserService.CreateUser(User user)
		{
			if (user == null || string.IsNullOrWhiteSpace(user.UserId))
				return CreateTransactionResponse(FeedBackType.Error, "Provided user details are invalid");

			var xDoc = XDocument.Load(FilePath);
			xDoc.Element("Root")?.AddFirst(new XElement(User, 
				new XElement(UserId, user.UserId),
				new XElement(FirstName, user.FirstName),
				new XElement(Surname, user.Surname),
				new XElement(Contact, user.Contact)
			));
			xDoc.Save(FilePath);
			return CreateTransactionResponse(FeedBackType.Success, "User created successfully");
		}

		TransactionResponse IUserService.UpdateUser(User updatedUser)
		{
			if(updatedUser == null || string.IsNullOrWhiteSpace(updatedUser.UserId))
				return CreateTransactionResponse(FeedBackType.Error, "Provided user details are invalid");

			var xDoc = XDocument.Load(FilePath);
			var oldUser = xDoc.Root?.Descendants(User)
				.FirstOrDefault(x => x.Element(UserId)?.Value == updatedUser.UserId);
			if(oldUser == null)
				return CreateTransactionResponse(FeedBackType.Warning, "User not found");

			oldUser.Element(FirstName)!.Value = updatedUser.FirstName;
			oldUser.Element(Surname)!.Value = updatedUser.Surname;
			oldUser.Element(Contact)!.Value = updatedUser.Contact;
			xDoc.Save(FilePath);
			return CreateTransactionResponse(FeedBackType.Success, "User updated successfully");
		}

		TransactionResponse IUserService.DeleteUser(string userId)
		{
			if (string.IsNullOrWhiteSpace(userId))
				return CreateTransactionResponse(FeedBackType.Error, "Provided user details are invalid");

			var xDoc = XDocument.Load(FilePath);
			var userToDelete = xDoc.Root?.Descendants(User)
				.FirstOrDefault(x => x.Element(UserId)?.Value == userId);
			if (userToDelete == null)
				return CreateTransactionResponse(FeedBackType.Warning, "User not found");

			userToDelete.Remove();
			xDoc.Save(FilePath);
			return CreateTransactionResponse(FeedBackType.Success, "User deleted successfully");
		}

		private static TransactionResponse CreateTransactionResponse(FeedBackType feedBackType, string msg)
		{
			return new TransactionResponse
			{
				FeedBackType = feedBackType,
				Message = msg
			};
		}
	}
}