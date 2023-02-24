using System.Collections.Generic;
using System.Threading.Tasks;
using e4UserCaptureSystem.Service.Model;

namespace e4UserCaptureSystem.Service
{
	public interface IUserService
	{
		Task<IEnumerable<User>> GetUsersAsync();
		TransactionResponse CreateUser(User user);
		TransactionResponse UpdateUser(User updatedUser);
		TransactionResponse DeleteUser(string userId);
	}
}