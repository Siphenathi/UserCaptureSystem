using e4UserCaptureSystem.Service;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace e4UserCaptureSystem.Host
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors(options =>
			{
				options.AddPolicy("default",
					builder => builder.AllowAnyOrigin()
						.AllowAnyMethod()
						.AllowAnyHeader());
			});
			services.AddControllers();
			services.AddScoped<IUserService>(serviceProvider => new UserService(GetFilePath()));
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			app.UseHttpsRedirection();
			app.UseRouting();
			//app.UseAuthorization();
			app.UseCors("default");
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}");
			});
		}

		private string GetFilePath()
		{
			return Path.Combine(
				Environment.CurrentDirectory.Replace(
					"e4UserCaptureSystem.Host", "e4UserCaptureSystem.Service"),
				Configuration.GetValue<string>("FilePathInProject"));
		}
	}
}
