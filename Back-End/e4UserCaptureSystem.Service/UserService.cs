using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using e4UserCaptureSystem.Service.Model;

namespace e4UserCaptureSystem.Service
{
	public class UserService
	{
		private string FilePath { get; }

		public UserService(string filePath)
		{
			FilePath = Path.Combine(Environment.CurrentDirectory, filePath);
		}

		public Task<IEnumerable<User>> GetUsersAsync()
		{
			var xDoc = XDocument.Load(FilePath);
			var collectionOfDescendentElements = xDoc.Root?.Descendants("User");
			var users = collectionOfDescendentElements?.Select(xElement => 
				new User
				{
					UserId = xElement.Element("UserId")?.Value,
					FirstName = xElement.Element("FirsName")?.Value, 
					Surname = xElement.Element("Surname")?.Value, 
					Contact = xElement.Element("Contact")?.Value
				}).ToList();

			return Task.FromResult<IEnumerable<User>>(users);
		}

		public void CreateUser(User user)
		{
			var xDoc = XDocument.Load(FilePath);
			xDoc.Root?.Add("User", 
				new XElement("UserId", user.UserId),
				new XElement("FirstName", user.FirstName),
				new XElement("Surname", user.Surname),
				new XElement("Contact", user.Contact)
			);
			xDoc.Save(FilePath);
		}
	}
}
